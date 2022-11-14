const CANPAR_LINK = "https://canpar.ca/en/tracking/track.htm?barcode=";
const CANADAPOST_LINK = "https://www.canadapost-postescanada.ca/track-reperage/en#/details/";

const redirect = (trackingNumber) => {
    if (trackingNumber.toUpperCase().startsWith("D")) {
        if (trackingNumber.includes("-")) {
            // there is a character limit when entering tracking numbers in the backend of the website.
            // therefore, we must limit it so we can put more tracking numbers in...

            // first, we split it to isolate the tracking numbers individually.
            const array = trackingNumber.split("-");

            // then, we grab the prefix (provided in the first tracking number)
            const prefix = array[0].slice(0, array[0].length - 4);

            // we then create a new array with all trackings (adding the prefix)
            const newTracking = [array[0]];
            for (var i = 1; i < array.length; i++)
                newTracking[i] = `${prefix}${array[i]}`;

            // join them together to form a proper Canpar url
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
        window.location.replace(`https://www.canadapost-postescanada.ca/track-reperage/en#/filterPackage?searchFor=${array.join(",")}`);window.close();

        return;
    }

    window.location.replace(`${CANADAPOST_LINK}${trackingNumber}`);
};

const params = new URLSearchParams(window.location.search);
const trackingNumber = params.get("trackingNumber");
redirect(trackingNumber);