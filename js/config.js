/**
 * MealRoll deployment configuration.
 * appStoreUrl is empty until the iOS app is live — leaving it empty renders the
 * Apple button as a disabled "Coming soon" state and hides its QR card.
 * After publishing on iOS, set appStoreUrl and regenerate assets/qr/appstore.png
 * with: npx qrcode "<url>" -o website/assets/qr/appstore.png -w 640 -m 2
 */
window.MEALROLL_CONFIG = Object.freeze({
  appStoreUrl: "",
  googlePlayUrl: "https://play.google.com/store/apps/details?id=com.mealroll.app",
  contactEmail: "support@avalongamestudios.com"
});
