# Paid social commerce considerations

TikTok traffic is predominantly mobile and interruption-based. The landing page must preserve the creative's promise, show the product and offer quickly, and provide a trustworthy low-friction checkout. The FLO product page meets the creative-continuity and merchandising requirements but currently fails several checkout-continuity requirements.

Amazon offers familiar checkout and marketplace trust, but a frequently returned item warning introduces a high-salience objection at the decision point. The FLO website avoids that warning and captures first-party customer value. Amazon Pay on Stripe can reduce payment friction, but an Amazon Pay purchase on the FLO website is not an Amazon marketplace order and will not improve Amazon sales rank or the return-badge calculation.

TikTok purchase optimization requires a verified purchase event. The local site implementation defines ViewContent, AddToCart, and InitiateCheckout mappings, but no purchase/CompletePayment event was found. Because checkout occurs on Stripe's domain, a successful payment must return to a tracked success page or be sent to TikTok through a server-side integration. Without that, TikTok cannot learn from completed website purchases reliably.
