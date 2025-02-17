import { useTranslation } from "react-i18next";
import { useState } from "react";

const LanguageSwitcher = () => {
	const { i18n } = useTranslation();
	const [currentLang, setCurrentLang] = useState(i18n.language || "en");

	const toggleLanguage = (lang: string) => {
		i18n.changeLanguage(lang);
		setCurrentLang(lang);
	};

	return (
		<div className="flex gap-6">
			<button
				onClick={() => toggleLanguage("en")}
				className={`w-14 h-14 border-2 rounded-full border-gray-300 transition-all ${
					currentLang == "nl" ? "opacity-50" : ""
				}`}
			>
				<img src={`img/flags/united-kingdom.png`} alt={"English"} />
			</button>
			<button
				onClick={() => toggleLanguage("nl")}
				className={`w-14 h-14 border-2 rounded-full border-gray-300 transition-all ${
					currentLang == "en" ? "opacity-50" : ""
				}`}
			>
				<img src={`img/flags/netherlands.png`} alt={"Dutch"} />
			</button>
		</div>
	);
};

export default LanguageSwitcher;
