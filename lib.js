async function Get_Address_type(address) {
    const url = `https://blockchair.com/search?q=${address}`;
    try {
        const response = await fetch(url);
        const html = await response.text();
        // Get Coin type
        if (!response.url.includes("https://blockchair.com/search")) {
            const typestartIndex = html.indexOf('<h1 class="fw-bold inline va-middle">') + '<h1 class="fw-bold inline va-middle">'.length;
            const typeendIndex = html.indexOf('<span class="color-text-secondary fw-medium">', typestartIndex);
            const type = html.substring(typestartIndex, typeendIndex).trim().replace(/&thinsp;/g, '');

            // return Coin address type
            return {
                "status": 200,
                "address": address,
                "address_type": type
            };
        } else {
            if (html.includes("Recheck the phrase and try again.")) {
                return {
                    "status": 404,
                    "address": address,
                    "address_type": null
                };
            }
            const typestartIndex = html.indexOf('<span class="fs-14 fw-600 mr-5">') + '<span class="fs-14 fw-600 mr-5">'.length;
            const typeendIndex = html.indexOf('</span>', typestartIndex);
            const type = html.substring(typestartIndex, typeendIndex).trim().replace(/&thinsp;/g, '');
            // return Coin address type
            return {
                "status": 200,
                "address": address,
                "address_type": type
            };
        }

    } catch (error) {
        console.error('Error fetching the data:', error);
        return { "status": 500, "msg": "Internal server error" };
    }
}


async function Get_Address_info(crypto, address) {
    const url = `https://blockchair.com/${crypto.toLowerCase()}/address/${address}`;
    try {
        const response = await fetch(url);
        const html = await response.text();
        if(response.status != 200){
            return { "status": response.status, "msg": response.statusText };
        }

        // Get Coin type
        const typestartIndex = html.indexOf('<h1 class="fw-bold inline va-middle">') + '<h1 class="fw-bold inline va-middle">'.length;
        const typeendIndex = html.indexOf('<span class="color-text-secondary fw-medium">', typestartIndex);
        const type = html.substring(typestartIndex, typeendIndex).trim().replace(/&thinsp;/g, '');

        // Get Coin balance
        const coinstartIndex = html.indexOf('class="color-text-success">+</span>') + 'class="color-text-success">+</span>'.length;
        const coinendIndex = html.indexOf('</span>', coinstartIndex);
        const coinAmount = parseFloat(html.substring(coinstartIndex, coinendIndex).trim().replace(/,/g, ''));

        // Get Coin to USD balance
        const usdIndexStart = html.indexOf('<span class="wb-bw">', coinendIndex) + '<span class="wb-bw">'.length;
        const usdIndexEnd = html.indexOf('</span>', usdIndexStart);
        const usdAmount = parseFloat(html.substring(usdIndexStart, usdIndexEnd).trim());

        // return Coin address data
        return {
            "status": response.status,
            "address": address,
            "address_type": type,
            "coin_balance": isNaN(coinAmount) ? 0 : coinAmount,
            "coin_to_usd_balance": isNaN(usdAmount) ? 0 : usdAmount,
        };
    } catch (error) {
        console.error('Error fetching the data:', error);
        return { "status": 500, "msg": "Internal server error" };
    }
}

module.exports = { Get_Address_type, Get_Address_info };