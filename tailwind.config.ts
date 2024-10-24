import forms from "@tailwindcss/forms"
import type { Config } from "tailwindcss"

export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],

	theme: {
		extend: {
			fontFamily: {
				pretendard: ["Pretendard Variable", "sans-serif"],
				"anonymous-pro": ["Anonymous Pro", "sans-serif"]
			}
		}
	},

	plugins: [forms]
} satisfies Config
