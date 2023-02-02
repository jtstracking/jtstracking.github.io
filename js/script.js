/**
 * Links for tracking information.
 */
const CANPAR_LINK = "https://canpar.ca/en/tracking/track.htm?barcode=";
const CANADAPOST_LINK = "https://www.canadapost-postescanada.ca/track-reperage/en#/details/";

/**
 * HTML content
 */
const invalidTrackingDetails = document.getElementById("invalid-tracking-details");

const trackingDetails = document.getElementById("tracking-details");
const trackingDetailsId = document.getElementById("tracking-details-id");
const trackingDetailsCount = document.getElementById("tracking-details-count");
const trackingDetailsList = document.getElementById("tracking-details-list");
const trackingDetailsCard = `
    <div class="tracking-details-card d-flex justify-content-between align-items-center">
        <h5>{trackingNumber}</h5>
        <a href="{link}">
            <button type="button" class="btn btn-primary">Track this parcel.</button>
        </a>
    </div>
`

const redirect = document.getElementById("redirecting");

const quickRedirect = (trackingNumber) => {
    if (trackingNumber.toUpperCase().startsWith("D")) {
        if (trackingNumber.includes("-")) {
            const array = trackingNumber.split("-");
            const prefix = array[0].slice(0, array[0].length - 4);
            const newTracking = [array[0]];
            for (var i = 1; i < array.length; i++)
                newTracking[i] = `${prefix}${array[i]}`;

            const newUrl = newTracking.join("%2C+");
            console.log(newTracking.join("%2C+"));
            window.location.replace(`${CANPAR_LINK}${newUrl}`);

            return;
        }

        window.location.replace(`${CANPAR_LINK}${trackingNumber}`);

        return;
    }

    // now, it would safe to assume it is canada post.
    if (trackingNumber.includes("-")) {
        const array = trackingNumber.split("-");
        window.location.replace(`https://www.canadapost-postescanada.ca/track-reperage/en#/filterPackage?searchFor=${array.join(",")}`); window.close();

        return;
    }

    window.location.replace(`${CANADAPOST_LINK}${trackingNumber}`);
}

const main = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlParamsLength = Array.from(urlParams).length;
    switch (urlParamsLength) {
        case 1:
            if (urlParams.has("trackingNumber")) {
                const trackingNumber = urlParams.get("trackingNumber");
                redirect.style.display = "inline";
                quickRedirect(trackingNumber);

                break;
            }

            // invalid.
            invalidTrackingDetails.style.display = "inline";
            console.log("Invalid tracking details...");

            break;
        case 2:
            if (urlParams.has("trackingNumber") && urlParams.has("orderNumber")) {
                const trackingNumber = urlParams.get("trackingNumber");
                const orderNumber = urlParams.get("orderNumber");
                trackingDetails.style.display = "inline";
                trackingDetailsId.innerHTML = trackingDetailsId.innerHTML.replace("{order_number}", orderNumber);

                const array = trackingNumber.split("-");
                const prefix = array[0].slice(0, array[0].length - 4);
                const newTracking = [array[0]];
                for (var i = 1; i < array.length; i++)
                    newTracking[i] = `${prefix}${array[i]}`;
                trackingDetailsCount.innerHTML = trackingDetailsCount.innerHTML.replace("{count}", newTracking.length);

                newTracking.forEach(number => {
                    trackingDetailsList.innerHTML += trackingDetailsCard
                        .replace("{trackingNumber}", number)
                        .replace("{link}", CANPAR_LINK + number);
                });

                break;
            }

            // invalid.
            invalidTrackingDetails.style.display = "inline";
            console.log("Invalid tracking details...");

            break;
        default:
            invalidTrackingDetails.style.display = "inline";
            console.log("Invalid tracking details...");

            break;
    }
};

main();