import type { prefix } from "./ipv6";

// C means container.
const prefixC = document.getElementById("prefix") as HTMLDivElement;
// fuac means first usable address container.
const fuac = document.getElementById("firstUsableAddress") as HTMLDivElement;
// luac means first usable address container.
const luac = document.getElementById("lastUsableAddress") as HTMLDivElement;
const hostC = document.getElementById("host") as HTMLSpanElement;
const outputHeader = document.getElementById("caption") as HTMLParagraphElement;
const subnetBitsInput = document.getElementById("subnetBits") as HTMLInputElement;


const formatNumber = (num: bigint) => {
    /**
     * This method adds comma when the num becomes 4 digits or more.
     * This takes an argument of type number.
     * Returns Number | String.
     */

    if (num < 1000) {
        return num.toString();
    }

    // Add comma.
    const text = num.toString();
    let textArray = text.split("");
    const textArrayReversed = textArray.reverse();
    // Add a comma after every three elements.
    let count = 0;
    for (let index = 0; index < textArrayReversed.length; index++) {
        if (count === 3) {
            textArrayReversed.splice(index, 0, ",")
            count = 0;
            continue;
        }
        count++;        
    }

    // Turn it to its original order.
    textArray = textArrayReversed.reverse();
    
    // Return it as string.    
    return textArray.join("");    
}


export const render = function (prefix: prefix): void  {
    /**
     * This method will display the prefix's: current subnet number, 
     * prefix, firt usable and last usable address.
    */

    // oht means output header text.
    const oht = BigInt(2 ** prefix.subnetPortion.length);
    // snt means subnet number text.
    const snt = prefix.subnetNumber.toString();    
    const hostText = (BigInt(2 ** prefix.interfaceIDPortion.bits) - 1n); // minus 1 because the prefix can't be used.
    const prefixText = prefix.prefix.toLocaleUpperCase();
    // fua means first usable address
    const fuaText = prefix.firstUsableAddress.toLocaleUpperCase();
    // fua means first usable address
    const luaText = prefix.lastUsableAddress.toLocaleUpperCase();
    
    // Displays.
    // Display the number of subnets.
    outputHeader.textContent = BigInt(subnetBitsInput.value) === 0n ? `There is ${formatNumber(oht)} subnet` : `There are ${formatNumber(oht)} subnets`;
    // Display the host per subnet.
    hostC.textContent = formatNumber(hostText);
    // Display the prefix.
    prefixC.textContent = prefixText;
    // Display the first usable address.
    fuac.textContent = fuaText;
    // Display the last usable addrress.
    luac.textContent = luaText;
    // Display the new prefix length.
    prefixC.nextElementSibling!.textContent = `/${prefix.newPrefixLength}`;
    fuac.nextElementSibling!.textContent = `/${prefix.newPrefixLength}`;
    luac.nextElementSibling!.textContent = `/${prefix.newPrefixLength}`;
}


export const renderWarningMessage = function (error: Error, attachTo: HTMLElement, preText="Error", alertType="danger")  {
    /**
     * This method displays error to the user using bootstrap alert component.
     * This method takes an error object and two optional arguments.
     * Returns html object.
     */
    
    // Create alert element
    const alert = document.createElement("div");
    // Add attributes to alert.
    alert.setAttribute("class", `alert alert-${alertType} alert-dismissible fade show`);
    alert.setAttribute("role", "alert");
    alert.style.fontSize = "1rem"

    // Create a message for alert element.
    alert.innerHTML = `<strong>${preText}</strong>: ${error.message}`;

    // Create a close button element for alert element.
    const button = document.createElement("button");
    // Add attributes to button.
    button.setAttribute("type", "button");
    button.setAttribute("class", "btn-close");
    button.setAttribute("data-bs-dismiss", "alert");
    button.setAttribute("aria-label", "Close");

    alert.appendChild(button);
    
    attachTo.insertAdjacentElement("afterbegin", alert);
}