
import { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '@/lib/firebase-admin';
import crypto from 'crypto';
import { buffer } from 'micro';

export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set([
  'subscription_created',
  'subscription_updated',
  'subscription_cancelled',
  'subscription_expired',
]);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const rawBody = await buffer(req);
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  const hmac = crypto.createHmac('sha256', secret!);
  const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
  const signature = Buffer.from(req.headers['x-signature'] as string, 'utf8');

  if (!crypto.timingSafeEqual(digest, signature)) {
    return res.status(400).json({ error: 'Invalid signature.' });
  }

  const event = JSON.parse(rawBody.toString());
  const eventName = event.meta.event_name;

  if (relevantEvents.has(eventName)) {
    try {
      const userId = event.meta.custom_data.user_id;
      if (!userId) {
        throw new Error('Webhook missing user_id in custom_data');
      }

      const userRef = firestore.collection('users').doc(userId);
      const subscriptionData = event.data.attributes;

      const userDataToUpdate = {
        lemonSqueezyId: subscriptionData.customer_id,
        lemonSqueezySubscriptionId: subscriptionData.id,
        subscriptionStatus: subscriptionData.status,
        updatePaymentMethodUrl: subscriptionData.urls.update_payment_method,
      };

      await userRef.update(userDataToUpdate);

    } catch (error: any) {
      console.error(`Webhook handler for ${eventName} failed:`, error.message);
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }

  res.status(200).json({ received: true });
}
