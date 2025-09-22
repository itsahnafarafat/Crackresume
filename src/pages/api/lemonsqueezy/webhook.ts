
import type { NextApiRequest, NextApiResponse } from 'next';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase'; // Ensure this path is correct
import crypto from 'crypto';

const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

if (!secret) {
  throw new Error('LEMONSQUEEZY_WEBHOOK_SECRET is not set in environment variables.');
}

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: any) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method Not Allowed');
  }

  const buf = await buffer(req);
  const rawBody = buf.toString('utf8');

  const hmac = crypto.createHmac('sha256', secret);
  const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
  const signature = Buffer.from(req.headers['x-signature'] as string, 'utf8');

  if (!crypto.timingSafeEqual(digest, signature)) {
    return res.status(400).send('Invalid signature.');
  }

  try {
    const payload = JSON.parse(rawBody);
    const { meta, data } = payload;
    
    // Check if it's a subscription creation event
    if (meta.event_name === 'subscription_created' || meta.event_name === 'order_created') {
      const userId = meta.custom_data?.user_id;

      if (!userId) {
        return res.status(400).send('Webhook Error: Missing user_id in custom_data');
      }
      
      const userRef = doc(firestore, 'users', userId);
      
      await updateDoc(userRef, {
        isPro: true, // Custom claim to mark user as Pro
        subscriptionId: data.id, // Store subscription ID
        variantId: data.attributes.variant_id
      });
    }

    return res.status(200).json({ status: 'ok' });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return res.status(500).send(`Webhook Error: ${error.message}`);
  }
}
