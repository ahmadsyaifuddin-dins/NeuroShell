export const copyProjectConfig = (licenseKey) => {
    // 1. URL Production
    const TARGET_URL = "https://neuro-shell.vercel.app/api/verify";

    // 2. Helper ASCII
    const toAscii = (str) => {
        return str.split('').map(char => char.charCodeAt(0)).join(', ');
    };

    const asciiUrl = toAscii(TARGET_URL);
    const asciiKey = toAscii(licenseKey);

    const textToCopy = `
        // --- [PASTE INI DI FILE: App/Traits/SystemIntegrityTrait.php] ---
        // Gantikan bagian "// 3. KONFIGURASI TERSEMBUNYI" dengan ini:

        // URL ENGINE
        $rawUrl = [${asciiUrl}];
        
        // LICENSE KEY: "${licenseKey}"
        $rawKey = [${asciiKey}];
    `;

    navigator.clipboard.writeText(textToCopy);
};