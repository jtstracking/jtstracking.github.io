const detect = (trackingNumber) => {
    if (trackingNumber.toUpperCase().startsWith("D")) {
        return Courier.canpar;
    }

    return Courier.canadaPost;
};

const params = new URLSearchParams(window.location.search);
const trackingNumber = params.get("trackingNumber");
const courier = detect(params);
console.log(`${courier.name}: ${trackingNumber}`);
courier.redirect(trackingNumber);

class Courier {
    static canpar = new Courier("Canpar", "https://canpar.ca/en/tracking/track.htm?barcode=");
    static canadaPost = new Courier("Canada Post", "https://www.canadapost-postescanada.ca/track-reperage/en#/details/");

    contructor(name, trackingLink) {
        this.name = name;
        this.trackingLink = trackingLink;
    }

    redirect(trackingNumber) {
        if (trackingNumber.includes("+")) {
            const array = trackingNumber.split("+");
            console.log(array);

            return;
        }

        window.location.replace(`${this.trackingLink}${trackingNumber}`);
    }
};