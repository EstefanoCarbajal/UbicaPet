const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/crear-sesion-pago', async (req, res) => {
  let line_items;
  if (req.body.tipo === 'premium') {
    line_items = [{ price: 'price_1RdmuHRtHUiOtuw9GPn7my6l', quantity: 1 }];
    mode = 'subscription';
  } else if (req.body.tipo === 'publicidad') {
    line_items = [{ price: 'price_1Rdn43RtHUiOtuw9zg2eqo0T', quantity: 1 }];
    mode = 'subscription';
  } else if (req.body.tipo === 'donacion') {
    const monto = parseFloat(req.body.monto);
    line_items = [{
      price_data: {
        currency: 'pen', // o 'usd' según tu moneda
        product_data: { name: 'Donación UbicaPet' },
        unit_amount: Math.round(monto * 100), // Stripe espera el monto en centavos
      },
      quantity: 1,
    }];
    mode = 'payment';
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items,
    mode,
    success_url: 'https://tu-app-production.up.railway.app/pagos-exito',
    cancel_url: 'https://ubicapet.up.railway.app/pagos',
  });

  res.redirect(303, session.url);
});

router.get('/pagos', (req, res) => {
  res.render('pagos');
});

module.exports = router;