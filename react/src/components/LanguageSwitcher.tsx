import { useTranslation } from "react-i18next";
import { useState } from "react";

const LanguageSwitcher = () => {
	const { i18n } = useTranslation();
	const [currentLang, setCurrentLang] = useState(i18n.language || "en");

	const toggleLanguage = () => {
		const newLang = currentLang === "en" ? "nl" : "en";
		i18n.changeLanguage(newLang);
		setCurrentLang(newLang);
	};

	return (
		<button
			onClick={toggleLanguage}
			className="w-18 h-18 border-2 rounded-full border-gray-300"
		>
			<img
				src={`img/flags/${
					currentLang === "en" ? "netherlands" : "united-kingdom"
				}.png`}
				alt={currentLang === "en" ? "Dutch" : "English"}
			/>
		</button>
	);
};

export default LanguageSwitcher;
