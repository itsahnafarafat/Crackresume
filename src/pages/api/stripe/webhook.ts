
import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe';
import { firestore } from '@/lib/firebase-admin';
import Stripe from 'stripe';
import { buffer } from 'micro';

export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) throw new Error('Missing Stripe signature or secret');
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          const userId = session.metadata?.userId;
          const stripeCustomerId = session.customer as string;

          if (!userId || !stripeCustomerId) {
            throw new Error('Missing userId or customerId in session metadata');
          }
          
          await firestore.collection('users').doc(userId).update({
            stripeCustomerId,
            subscriptionStatus: 'active',
          });
          break;
        }
        case 'customer.subscription.updated': {
          const subscription = event.data.object as Stripe.Subscription;
          const stripeCustomerId = subscription.customer as string;
          
          const userQuery = await firestore.collection('users').where('stripeCustomerId', '==', stripeCustomerId).get();
          if (userQuery.empty) throw new Error('User not found for customer ID');
          
          const userId = userQuery.docs[0].id;
          await firestore.collection('users').doc(userId).update({
            subscriptionStatus: subscription.status,
          });
          break;
        }
        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          const stripeCustomerId = subscription.customer as string;
          
          const userQuery = await firestore.collection('users').where('stripeCustomerId', '==', stripeCustomerId).get();
           if (userQuery.empty) throw new Error('User not found for customer ID');

          const userId = userQuery.docs[0].id;
          await firestore.collection('users').doc(userId).update({
            subscriptionStatus: 'canceled',
          });
          break;
        }
        default:
          throw new Error('Unhandled relevant event!');
      }
    } catch (error) {
      console.error('Webhook handler error:', error);
      return res.status(400).send('Webhook handler failed. View logs.');
    }
  }

  res.status(200).json({ received: true });
}
