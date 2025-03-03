import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

if (!localStorage.getItem("i18nextLng")) {
	localStorage.setItem("i18nextLng", "en");
}

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: {
			en: {
				translation: {
					// TopBar.tsx
					cancel_order: "Cancel Order",
					keep_ordering: "No, keep ordering",
					cancel_confirm: "Yes, cancel order",
					cancel_popup: "Are you sure you want to cancel this order?",
					// IdleScreen.tsx
					idle_title: "Brighten up your day,",
					idle_span_1: "the",
					idle_span_2: "green",
					idle_span_3: "way",
					idle_p: "Happy Herbivore - Healthy in a Hurry",
					takeaway: "Take Out",
					eat_in: "Dine In",
					// Order.tsx
					review_order: "Review your Order",
					basket_empty: "Your basket is empty",
					per_piece: "per piece",
					order_calories: "Calories",
					order_total: "Total: ",
					checkout: "Proceed to checkout",
					payable_amount: "Payable Amount: ",
					follow_terminal: "Please follow the instructions on the terminal",
					// Confirmation.tsx
					thank_you: "Thank you for your order!",
					order_number: "Your order number is ",
					back_to_homepage: "Back to the homepage",
					// ProductDetails.tsx
					daily_intake: "of daily intake",
					basket_add: "Add to basket",
					basket_confirmation: "Product(s) added to basket!",
				},
			},
			nl: {
				translation: {
					// TopBar.tsx
					cancel_order: "Bestelling Annuleren",
					keep_ordering: "Nee, verder met bestellen",
					cancel_confirm: "Ja, annuleer bestelling",
					cancel_popup: "Weet je zeker dat je de bestelling wilt annuleren?",
					// IdleScreen.tsx
					idle_title: "Verlicht je dag,",
					idle_span_1: "de",
					idle_span_2: "groene",
					idle_span_3: "manier",
					idle_p: "Happy Herbivore - Snel en Gezond",
					takeaway: "Meenemen",
					eat_in: "Hier Eten",
					// Order.tsx
					review_order: "Bekijk je bestelling",
					basket_empty: "Je mandje is leeg",
					per_piece: "per stuk",
					order_calories: "Calorieën",
					order_total: "Totaal: ",
					checkout: "Ga naar afrekenen",
					payable_amount: "Te betalen bedrag: ",
					follow_terminal: "Volg de instructies op het scherm",
					// Confirmation.tsx
					thank_you: "Bedankt voor je bestelling!",
					order_number: "Je bestelnummer is ",
					back_to_homepage: "Terug naar de homepagina",
					// ProductDetails.tsx
					daily_intake: "van dagelijkse inname",
					basket_add: "Aan mandje toevoegen",
					basket_confirmation: "Product(en) toegevoegd aan mandje!",
				},
			},
		},

		fallbackLng: "nl",
		interpolation: {
			escapeValue: false,
		},
	});

export default i18n;
