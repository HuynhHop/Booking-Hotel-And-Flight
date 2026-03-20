const Favorite = require("../models/Favorite");
const User = require("../models/User");
const { sendMail } = require("./sendMail");

// Hàm chính xử lý alert
const handlePriceDrop = async (hotel, oldPrice, newPrice) => {
  try {
    // 1. Check giảm giá
    if (!oldPrice || !newPrice || newPrice >= oldPrice) return;

    const dropPercent = ((oldPrice - newPrice) / oldPrice) * 100;

    // Chỉ trigger nếu giảm >= 10%
    if (dropPercent < 10) return;

    // 2. Lấy followers
    const favorites = await Favorite.find({ hotelId: hotel._id });

    if (!favorites.length) return;

    // 3. Lấy user
    const userIds = favorites.map(f => f.userId);

    const users = await User.find({
      _id: { $in: userIds }
    });

    // Map user nhanh hơn
    const userMap = new Map();
    users.forEach(u => userMap.set(u._id.toString(), u));

    const start = Date.now();
    // 4. Gửi email theo threshold từng user
    let sentCount = 0;

    for (const fav of favorites) {
      const threshold = fav.alertThreshold || 10;

      if (dropPercent >= threshold) {
        const user = userMap.get(fav.userId.toString());

        if (!user) continue;

        await sendMail("🔥 Price Drop Alert", {
          email: user.email,
          html: `
<div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden;">
    
    <!-- HEADER -->
    <tr>
      <td style="background:#2c3e50; color:#ffffff; padding:20px; text-align:center;">
        <h1 style="margin:0;">🌍 Travel Booking Platform </h1>
        <p style="margin:5px 0 0;">Price Alert Notification</p>
      </td>
    </tr>

    <!-- BODY -->
    <tr>
      <td style="padding:20px;">
        <h2 style="color:#e74c3c;">🔥 Price Drop Alert!</h2>

        <p>Good news! A hotel you follow just dropped in price:</p>

        <div style="background:#f9f9f9; padding:15px; border-radius:8px; margin:15px 0;">
          <h3 style="margin:0;">🏨 ${hotel.name}</h3>
          
          <p style="margin:10px 0;">
            <span style="text-decoration:line-through; color:#999;">
              $${oldPrice}
            </span>
            <span style="font-size:20px; color:#27ae60; font-weight:bold; margin-left:10px;">
              $${newPrice}
            </span>
          </p>

          <p style="color:#e74c3c; font-weight:bold;">
            🔻 Save ${dropPercent.toFixed(2)}%
          </p>
        </div>

        <!-- CTA BUTTON -->
        <div style="text-align:center; margin:25px 0;">
          <a href="https://rococo-muffin-811700.netlify.app/hotelInfo?id=${hotel._id}"
             style="background:#3498db; color:#fff; padding:12px 20px; text-decoration:none; border-radius:5px; font-weight:bold;">
            View Hotel
          </a>
        </div>

        <p style="color:#555;">
          Book now before the price goes up again!
        </p>
      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td style="background:#ecf0f1; padding:15px; text-align:center; font-size:12px; color:#777;">
        <p style="margin:5px 0;">© 2026 Travel Booking Platform</p>
        <p style="margin:5px 0;">You're receiving this because you favorited this hotel.</p>
        <p style="margin:5px 0;">
          <a href="#" style="color:#3498db;">Unsubscribe</a>
        </p>
      </td>
    </tr>

  </table>
</div>
`
        });

        sentCount++;
      }
    }

    console.log(`✅ Sent ${sentCount} price alert emails`);
    // đoạn gửi mail

    const end = Date.now();

    const duration = end - start;

    console.log(`✅ Sent ${sentCount} emails in ${duration} ms`);
  } catch (error) {
    console.error("❌ Price Alert Error:", error);
  }
};

module.exports = {
  handlePriceDrop
};