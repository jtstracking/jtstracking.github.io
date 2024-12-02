/**
 * Links for tracking information.
 */
const CANPAR_LINK = "https://canpar.ca/en/tracking/track.htm?barcode=";
const UPS_LINK = "https://www.ups.com/track?track=yes&trackNums={barcode}&loc=en_US&requester=ST/trackdetails";
const CANADAPOST_LINK = "https://www.canadapost-postescanada.ca/track-reperage/en#/details/";

class TrackingNumber {
  constructor(trackingNumber) {
    this.trackingNumber = trackingNumber.toUpperCase();
    if (this.trackingNumber.startsWith("D43400079") || this.trackingNumber.startsWith("U43400079")) {
      this.trackingLink = `${CANPAR_LINK}${this.trackingNumber}`;
    } else if (this.trackingNumber.startsWith("1Z")) {
      this.trackingLink = UPS_LINK.replace("{barcode}", this.trackingNumber);
    } else {
      this.trackingLink = `${CANADAPOST_LINK}${this.trackingNumber}`;
    }
  }

  append() {
    const trackingDetailsList = document.getElementById("tracking-details-list");
    const trackingDetailsCard = `<div class="tracking-details-card d-flex justify-content-between align-items-center">
            <h5>{trackingNumber}</h5>
            <a href="{link}">
            <button type="button" class="btn btn-primary">Track this parcel.</button>
            </a>
            </div>`;

    trackingDetailsList.innerHTML += trackingDetailsCard
      .replace("{trackingNumber}", this.trackingNumber)
      .replace("{link}", this.trackingLink);
  }
}

const trackingDetails = document.getElementById("tracking-details");
const trackingDetailsId = document.getElementById("tracking-details-id");
const trackingDetailsCount = document.getElementById("tracking-details-count");
const invalidTrackingDetails = document.getElementById("invalid-tracking-details");

const findTrackingNumbers = (trackingNumber) => {
  const trackingNumbers = [];
  if (trackingNumber.toUpperCase().startsWith("D43400079") || trackingNumber.toUpperCase().startsWith("U43400079")) {
    if (trackingNumber.includes("-")) {
      const array = trackingNumber.split("-");
      const prefix = array[0].slice(0, array[0].length - 4);
      trackingNumbers.push(new TrackingNumber(array[0]));
      for (var i = 1; i < array.length; i++) trackingNumbers.push(new TrackingNumber(`${prefix}${array[i]}`));
    } else {
      trackingNumbers.push(new TrackingNumber(trackingNumber));
    }
  } else {
    if (trackingNumber.includes("-"))
      trackingNumber.split("-").forEach((x) => trackingNumbers.push(new TrackingNumber(x)));
    else trackingNumbers.push(new TrackingNumber(trackingNumber));
  }

  return trackingNumbers;
};

const main = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const urlParamsLength = Array.from(urlParams).length;
  switch (urlParamsLength) {
    case 1:
      if (urlParams.has("trackingNumber")) {
        const quick = document.getElementById("quick");
        const quickCount = document.getElementById("quick-count");
        const quickList = document.getElementById("quick-list");
        quick.style.display = "inline";

        const trackingNumber = urlParams.get("trackingNumber");
        const trackingNumbers = findTrackingNumbers(trackingNumber);
        quickCount.innerHTML = quickCount.innerHTML.replace("{count}", trackingNumbers.length);
        trackingNumbers.forEach(
          (x) => (quickList.innerHTML += `<li><a href="${x.trackingLink}">${x.trackingNumber}</a></li>`)
        );

        break;
      }

      // invalid.
      invalidTrackingDetails.style.display = "inline";
      console.log("Invalid tracking details...");

      break;
    case 2:
      if (urlParams.has("trackingNumber") && urlParams.has("orderNumber")) {
        const trackingNumber = urlParams.get("trackingNumber");
        const orderNumber = urlParams.get("orderNumber").toUpperCase();
        trackingDetails.style.display = "inline";
        trackingDetailsId.innerHTML = trackingDetailsId.innerHTML.replace("{order_number}", orderNumber);

        const trackingNumbers = findTrackingNumbers(trackingNumber);
        trackingDetailsCount.innerHTML = trackingDetailsCount.innerHTML.replace("{count}", trackingNumbers.length);
        trackingNumbers.forEach((x) => x.append());

        break;
      }

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
