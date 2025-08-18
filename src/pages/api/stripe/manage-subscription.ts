
import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe';
import { firestore } from '@/lib/firebase-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    const userDoc = await firestore.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const { stripeCustomerId } = userDoc.data()!;
    if (!stripeCustomerId) {
      return res.status(400).json({ error: 'Stripe customer ID not found for this user.' });
    }
    
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    });

    res.status(200).json({ url: portalSession.url });

  } catch (error: any) {
    console.error('Manage Subscription Error:', error);
    res.status(500).json({ error: error.message });
  }
}
