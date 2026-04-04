export const welcomeEmailTemplate = (firstName) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: #181818; padding: 30px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 28px; margin: 0; letter-spacing: 4px; }
    .content { padding: 40px 30px; }
    .content h2 { font-size: 22px; color: #181818; margin-bottom: 15px; }
    .content p { font-size: 15px; color: #555; line-height: 1.6; }
    .btn { display: inline-block; background: #181818; color: #ffffff; padding: 14px 40px; text-decoration: none; font-size: 14px; letter-spacing: 2px; margin-top: 20px; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>RAWTHREAD</h1></div>
    <div class="content">
      <h2>Welcome to the family, ${firstName}!</h2>
      <p>Thanks for signing up. You're now part of a community of over 10 million athletes worldwide.</p>
      <p>Get ready for exclusive drops, early access to sales, and workout inspiration delivered straight to your inbox.</p>
      <a href="${process.env.CLIENT_URL}" class="btn">START SHOPPING</a>
    </div>
    <div class="footer">&copy; ${new Date().getFullYear()} RAWTHREAD. All rights reserved.</div>
  </div>
</body>
</html>`;

export const resetPasswordTemplate = (resetUrl) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: #181818; padding: 30px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 28px; margin: 0; letter-spacing: 4px; }
    .content { padding: 40px 30px; }
    .content h2 { font-size: 22px; color: #181818; }
    .content p { font-size: 15px; color: #555; line-height: 1.6; }
    .btn { display: inline-block; background: #181818; color: #ffffff; padding: 14px 40px; text-decoration: none; font-size: 14px; letter-spacing: 2px; margin-top: 20px; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>RAWTHREAD</h1></div>
    <div class="content">
      <h2>Reset Your Password</h2>
      <p>We received a request to reset your password. Click the button below to create a new one.</p>
      <a href="${resetUrl}" class="btn">RESET PASSWORD</a>
      <p style="margin-top: 20px;">If you didn't request this, please ignore this email. This link expires in 1 hour.</p>
    </div>
    <div class="footer">&copy; ${new Date().getFullYear()} RAWTHREAD. All rights reserved.</div>
  </div>
</body>
</html>`;

export const orderConfirmationTemplate = (order) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: #181818; padding: 30px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 28px; margin: 0; letter-spacing: 4px; }
    .content { padding: 40px 30px; }
    .content h2 { font-size: 22px; color: #181818; }
    .content p, .content td { font-size: 14px; color: #555; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #eee; }
    th { font-weight: 600; color: #181818; }
    .total-row td { font-weight: 600; color: #181818; border-top: 2px solid #181818; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>RAWTHREAD</h1></div>
    <div class="content">
      <h2>Order Confirmed! 🎉</h2>
      <p>Thank you for your order <strong>${order.orderNumber}</strong>.</p>
      <table>
        <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
        ${order.items.map(item => `<tr><td>${item.name} (${item.size}, ${item.color})</td><td>${item.quantity}</td><td>$${item.priceAtPurchase.toFixed(2)}</td></tr>`).join('')}
        <tr class="total-row"><td colspan="2">Total</td><td>$${order.total.toFixed(2)}</td></tr>
      </table>
      <p>We'll send you a shipping notification once your order is on its way.</p>
    </div>
    <div class="footer">&copy; ${new Date().getFullYear()} RAWTHREAD. All rights reserved.</div>
  </div>
</body>
</html>`;

export const shippingNotificationTemplate = (order) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: #181818; padding: 30px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 28px; margin: 0; letter-spacing: 4px; }
    .content { padding: 40px 30px; }
    .content h2 { font-size: 22px; color: #181818; }
    .content p { font-size: 15px; color: #555; line-height: 1.6; }
    .tracking { background: #f5f5f5; padding: 20px; margin: 20px 0; text-align: center; }
    .tracking p { font-size: 18px; font-weight: 600; color: #181818; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>RAWTHREAD</h1></div>
    <div class="content">
      <h2>Your Order Is On Its Way! 📦</h2>
      <p>Great news! Order <strong>${order.orderNumber}</strong> has been shipped.</p>
      <div class="tracking">
        <p>Tracking Number: ${order.trackingNumber || 'N/A'}</p>
        <p>Carrier: ${order.shippingCarrier || 'N/A'}</p>
      </div>
    </div>
    <div class="footer">&copy; ${new Date().getFullYear()} RAWTHREAD. All rights reserved.</div>
  </div>
</body>
</html>`;
