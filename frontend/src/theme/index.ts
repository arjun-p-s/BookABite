import { createSystem, defaultConfig } from "@chakra-ui/react";

export const system = createSystem(defaultConfig, {
    theme: {
        tokens: {
            colors: {
                brand: {
                    500: { value: "#6C63FF" },
                },
                background: {
                    primary: { value: "-webkit-linear-gradient(135deg, hsla(270, 73%, 35%, 1) 0%, hsla(275, 100%, 89%, 1) 100%);" },
                },
            },
        },
    },
});