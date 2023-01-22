import Prefix from "./ipv6.js";
import { render, renderWarningMessage, resetModalContent, removeAlertMessage } from "./view.js";

const ipv6AddressInput = document.getElementById("ipv6Address") as HTMLInputElement;
const prefixLengthInput = document.getElementById("prefixLength") as HTMLInputElement;
const subnetBitsInput = document.getElementById("subnetBits") as HTMLInputElement;
const outputSection = document.getElementById("outputSection") as HTMLDivElement;
const subnetNumberInput = document.getElementById("subnetNumber") as HTMLInputElement;
const modalHeading = document.querySelector('.modal-title') as HTMLHeadElement;
const modalBody = document.querySelector(".modal-body") as HTMLElement
const modalInputLabel = document.getElementById("modal-input-label") as HTMLLabelElement;
const modalInput = document.getElementById("modal-input") as HTMLInputElement;
const modalOutput = document.getElementById("modal-output") as HTMLInputElement;
const modalOutputLabel = document.getElementById("modal-output-label") as HTMLLabelElement;
const modalSwitchButton = document.getElementById("modal-switch-button") as HTMLButtonElement;
const ipv6TypeSource = document.getElementById("modalSourceLink") as HTMLAnchorElement;
const modalSubmitButton = document.getElementById("modal-submit-button") as HTMLButtonElement;

const checkInputs = function (): boolean | Error {
    /**
     * This function will check user's inputs: ipv6 address, prefix length,
     * subnet bits and the particular subnet user's looking for.
     */

    try {
        const ipv6Address = ipv6AddressInput.value;
        const prefixLength = prefixLengthInput.value;
        const subnetBits = subnetBitsInput.value;
        const subnetToFind = subnetNumberInput.value;        
        let errorCount = 0;
        let errorMessage = "";

        // Check the ipv6 address.
        if (Prefix.ipv6Format(ipv6Address) === false) {
            // Remove first the .is-valid if it's exists.
            ipv6AddressInput.classList.remove("is-valid");
            // Then add .is-invalid.
            ipv6AddressInput.classList.add("is-invalid");
            // Set error message.
            errorMessage = ipv6Address === '' ? "IPv6 addrress field cannot be empty!" : "Invalid IPv6 Address Format!";
            errorCount++;
        }
        // Check the prefix length.
        if (prefixLengthInput.value === '' || parseInt(prefixLength) <= 0 || parseInt(prefixLength) >= 128) {
            // Remove first the .is-valid if it's exists.
            prefixLengthInput.classList.remove("is-valid");
            // Then add .is-invalid.
            prefixLengthInput.classList.add("is-invalid");
            // Set error message.
            errorMessage = prefixLength === '' ? "Prefix length field cannot be empty!" : "Invalid Prefix Length!";
            errorCount++;
        }
        // Check the subnet bits.
        if (subnetBitsInput.value === '' || parseInt(subnetBits) < 0 || parseInt(prefixLength) + parseInt(subnetBits) >= 126) {
            // Remove first the .is-valid if it's exists.
            subnetBitsInput.classList.remove("is-valid");
            // Then add .is-invalid.
            subnetBitsInput.classList.add("is-invalid");
            // Set error message.
            errorMessage = subnetBits === '' ? "Subnet bits field cannot be empty!" : "Invalid Subnet Bits!";
            errorCount++;
        }   
        // Check the subnet that is looking for.
        const numOfNetworks = BigInt(2 ** parseInt(subnetBits)) - 1n;
        if (BigInt(subnetToFind) < 0 || BigInt(subnetToFind) > numOfNetworks ) {
            // Set error message.
            errorMessage = `Subnet ${subnetToFind} does not exists!`;
            errorCount++;
        }
        
        // If there's an error.
        if (errorCount > 1) {
            // If there's more than one error, set the new error messsage.
            errorMessage = "Incorrect IP Informations!";
            throw new Error(errorMessage);            
        } else if (errorCount === 1) {
            // If there's only one error, use the particular message.
            throw new Error(errorMessage);            
        }

        // Otherwise valid, return true.
        return true;

    } catch (error: any) {
        console.log(error);
        
        if (ipv6AddressInput.value === '' && prefixLengthInput.value === '' && subnetBitsInput.value === '') {
            return new Error("Incorrect IP Informations!");
        } 
        else if (error instanceof RangeError) {
            return new Error("Subnet Bits field cannot be empty!");
        }

        return new Error(error.message);
    }        
}


export const getPrefix = function (subnetToFind: string="0"): void {
    /**
     * This function will respond to the click events from the form's
     * button element.
     * This functions takes an optional argument of type string, because
     * by default it will calculate the subnet zero.
     * It will get the user's input: ipv6 address, prefix length
     * and subnet bits.
     * It will call the render method to display the results in the
     * HTML document.      
    */

    // Check user inputs
    const result = checkInputs();
    // If they are invalid, then display error messages.
    if (result instanceof Error) {
        renderWarningMessage(result, outputSection);
        return;
    }

    const ipv6Value = ipv6AddressInput.value;
    const prefixLengthValue = parseInt(prefixLengthInput.value);
    const subnetBitsValue = parseInt(subnetBitsInput.value);
        
    // Get the prefix.
    const prefix = Prefix.getPrefix(ipv6Value, prefixLengthValue, subnetBitsValue, subnetToFind) as Prefix;
    
    // Set the max attribute of the subnet number input for users convenience.    
    const numOfSubnets = BigInt(2 ** subnetBitsValue);
    subnetNumberInput.setAttribute("max", `${numOfSubnets - 1n}`);

    // Display the prefix.
    render(prefix);
}

export const updateModalContent = (
    modalTitle: string, 
    inputLabel: string, 
    outputLabel: string,
    removeSourceLink: boolean
    ) => {
    /**
     * This function will update modal's content.
     */    
    
    // First, reset modal's content.
    resetModalContent(modalInput, modalOutput, modalBody);

    // Update the modal title.
    modalHeading.textContent = modalTitle;
    // Update the input label.
    modalInputLabel.textContent = inputLabel;
    // Update the output label.
    modalOutputLabel.textContent = outputLabel;

    if (modalTitle === "Validations" ||  modalTitle === "Utilities") {
        // Update modal's ouput label.
        modalOutputLabel.textContent = "Output";
        // Hide the switch button.
        modalSwitchButton.classList.remove("visually-hidden");
        modalSwitchButton.classList.add("visually-hidden");
    } else if (modalTitle === "Generates") {
        // Hide the switch button.
        modalSwitchButton.classList.remove("visually-hidden");
        modalSwitchButton.classList.add("visually-hidden");
    } else {
        // Otherwise the modal is for conversions, show the switch button.
        modalSwitchButton.classList.remove("visually-hidden");        
    }

    // Determine whether to show modal's source link or not.
    if (removeSourceLink) {
        // If the modal isn't about the IPv6 Address type, don't show it.
        ipv6TypeSource.classList.remove("visible");
        ipv6TypeSource.classList.add("invisible");
    } else {
        // Otherwise it is about IPv6 Address type, then display the source link.
        ipv6TypeSource.classList.remove("invisible");
        ipv6TypeSource.classList.add("visible");
    }
}

export const modalOperation = (operation: string) => {
    /**
     * This function will perform modal's chosen operation.
     * Brackets are added to every case to add lexical scope.
     */
    
    switch (operation) {
        // Conversions operation.        
        case "bin-hex": {
            const bin = modalInput.value;
            const result = Prefix.binToHex(bin);

            if (result instanceof Error) {
                // Remove first the .is-valid if it's exists.
                modalInput.classList.remove("is-valid");
                // Then add .is-invalid.
                modalInput.classList.add("is-invalid");
                // Display error message.
                const error = bin === '' ? new Error("Input cannot be empty!") : result;
                renderWarningMessage(error, modalBody);
                // Reset the output text.
                modalOutput.classList.remove("is-valid");                
                modalOutput.value = "Output";
                break;
            }

            // Otherwise success.
            modalOutput.classList.add("is-valid");
            modalOutput.value = result;
            break;
        }            
        case "hex-bin": {
            const hex = modalInput.value.toLowerCase();
            const result = Prefix.hexToBin(hex);
            
            if (result instanceof Error) {
                // Remove first the .is-valid if it's exists.
                modalInput.classList.remove("is-valid");
                // Then add .is-invalid.
                modalInput.classList.add("is-invalid");
                // Display error message.
                const error = modalInput.value === '' ? new Error("Input cannot be empty!") : result;                
                renderWarningMessage(error, modalBody);
                // Reset the output text.
                modalOutput.classList.remove("is-valid");
                modalOutput.value = "Output";
                break;
            }

            // Otherwise success.
            modalOutput.classList.add("is-valid");
            modalOutput.value = result;
            break;
        }
        case "dec-bin": {
            const dec = modalInput.value;
            const result = Prefix.decToBin(dec);

            if (result instanceof Error) {
                // Remove first the .is-valid if it's exists.
                modalInput.classList.remove("is-valid");
                // Then add .is-invalid.
                modalInput.classList.add("is-invalid");
                // Display error message.
                const error = dec === '' ? new Error("Input cannot be empty!") : new Error("Input must be integers!");
                renderWarningMessage(error, modalBody);                
                // Reset the output text.
                modalOutput.classList.remove("is-valid");
                modalOutput.value = "Output";                
                break;
            }

            // Otherwise success.
            modalOutput.classList.add("is-valid");
            modalOutput.value = result;
            break;
        }
        case "bin-dec": {
            const bin = modalInput.value;
            const result = Prefix.binToDec(bin);

            if (result instanceof Error) {
                // Remove first the .is-valid if it's exists.
                modalInput.classList.remove("is-valid");
                // Then add .is-invalid.
                modalInput.classList.add("is-invalid");
                // Display error message.
                const error = bin === '' ? new Error("Input cannot be empty!") : result;
                renderWarningMessage(error, modalBody);
                // Reset the output text.
                modalOutput.classList.remove("is-valid");
                modalOutput.value = "Output";
                break;
            }

            // Otherwise success.
            modalOutput.classList.add("is-valid");
            modalOutput.value = result.toString(); 
            break;
        }
        case "hex-dec": {
            const hex = modalInput.value.toLowerCase();
            const result = Prefix.hexToDec(hex);

            if (result instanceof Error) {
                // Remove first the .is-valid if it's exists.
                modalInput.classList.remove("is-valid");
                // Then add .is-invalid.
                modalInput.classList.add("is-invalid");
                // Display error message.
                const error = hex === '' ? new Error("Input cannot be empty!") : result;
                renderWarningMessage(error, modalBody);
                // Reset the output text.
                modalOutput.classList.remove("is-valid");
                modalOutput.value = "Output";
                break;
            }
            
            // Otherwise success.
            modalOutput.classList.add("is-valid");
            modalOutput.value = result.toString(); 
            break;
        }
        case "dec-hex": {
            const dec = modalInput.value;
            const result = Prefix.decToHex(dec);

            if (result instanceof Error) {
                // Remove first the .is-valid if it's exists.
                modalInput.classList.remove("is-valid");
                // Then add .is-invalid.
                modalInput.classList.add("is-invalid");
                // Display error message.
                const error = dec === '' ? new Error("Input cannot be empty!") : new Error("Input must be integers!");
                renderWarningMessage(error, modalBody);                
                // Reset the output text.
                modalOutput.classList.remove("is-valid");
                modalOutput.value = "Output";                
                break;
            }

            // Otherwise success.
            modalOutput.classList.add("is-valid");
            modalOutput.value = result;
            break;
        }
        // Validations operation.
        case "ipv6-format": {
            const ipv6 = modalInput.value.toLowerCase();
            const result = Prefix.ipv6Format(ipv6);

            if (!result) {
                // Remove first the .is-valid if it's exists.
                modalInput.classList.remove("is-valid");
                // Then add .is-invalid.
                modalInput.classList.add("is-invalid");
                // Display error message.
                const error = ipv6 === '' ? new Error("Input cannot be empty!") : new Error("Invalid IPv6 Address Format!");
                renderWarningMessage(error, modalBody);                 
                // Reset the output text.
                modalOutput.classList.remove("is-valid");
                modalOutput.value = "Output"; 
                break;
            }

            // Otherwise success.
            modalOutput.classList.add("is-valid");
            modalOutput.value = "Valid IPv6 Address Format.";
            break;
        }
        case "mac-format": {
            const maca = modalInput.value.toLowerCase();
            const result = Prefix.macaFormat(maca);

            if (!result) {
                // Remove first the .is-valid if it's exists.
                modalInput.classList.remove("is-valid");
                // Then add .is-invalid.
                modalInput.classList.add("is-invalid");
                // Display error message.
                const error = maca === '' ? new Error("Input cannot be empty!") : new Error("Invalid MAC Address Format!");
                renderWarningMessage(error, modalBody);
                // Reset the output text.
                modalOutput.classList.remove("is-valid");
                modalOutput.value = "Output"; 
                break;
            }

            // Otherwise success.
            modalOutput.classList.add("is-valid");
            modalOutput.value = "Valid MAC Address Format.";            
            break;
        }
        case "ipv6-type": {
            
            break;
        }
        // Generates operation.
        case "interfaceID-eui-64": {
            const maca = modalInput.value.toLowerCase();
            const result = Prefix.eui_64(maca);

            if (result instanceof Error) {
                // Remove first the .is-valid if it's exists.
                modalInput.classList.remove("is-valid");
                // Then add .is-invalid.
                modalInput.classList.add("is-invalid");
                // Display error message.
                const error = maca === '' ? new Error("Input cannot be empty!") : result;
                renderWarningMessage(error, modalBody);
                // Reset the output text.
                modalOutput.classList.remove("is-valid");
                modalOutput.value = "Output";
                break;
            }
            
            // Otherwise success.
            modalOutput.classList.add("is-valid");
            modalOutput.value = result.toUpperCase();
            break;
        }
        case "ipv6-eui-64": {
            const ipv6Address = ipv6AddressInput.value.toLowerCase();
            const maca = modalInput.value.toLowerCase();
            const result = Prefix.ipv6_eui64(ipv6Address, maca) as string;

            if (ipv6Address === '' || Prefix.ipv6Format(ipv6Address) === false) {
                // Display error message.
                const error = ipv6Address === '' ? new Error("Include an IPv6 address in the background!") : new Error("Invalid IPv6 address!");
                renderWarningMessage(error, modalBody);
                break;              
            }

            if (Prefix.macaFormat(maca) === false) {
                // Remove first the .is-valid if it's exists.
                modalInput.classList.remove("is-valid");
                // Then add .is-invalid.
                modalInput.classList.add("is-invalid");
                // Display error message.
                const error = maca === '' ? new Error("MAC Address field cannot be empty!") : new Error("Invalid MAC Address!");
                renderWarningMessage(error, modalBody);
                // Reset the output text.
                modalOutput.classList.remove("is-valid");
                modalOutput.value = "Output";
                break;
            }

            // Otherwise success.
            modalOutput.classList.add("is-valid");
            modalOutput.value = result.toUpperCase();
            break;
        }
        case "solicited-node":{
            const ipv6 = modalInput.value.toLowerCase();
            const result = Prefix.solicitedNode(ipv6);

            if (result instanceof Error) {
                // Remove first the .is-valid if it's exists.
                modalInput.classList.remove("is-valid");
                // Then add .is-invalid.
                modalInput.classList.add("is-invalid");
                // Display error message.
                const error = ipv6 === '' ? new Error("Input cannot be empty!") : result;
                renderWarningMessage(error, modalBody);
                // Reset the output text.
                modalOutput.classList.remove("is-valid");
                modalOutput.value = "Output";
                break;
            }

            // Otherwise success.
            modalOutput.classList.add("is-valid");
            modalOutput.value = result.toUpperCase();
            break;
        }
        case "link-local": {
            const maca = modalInput.value.toLowerCase();
            const result = Prefix.linkLocal(maca);

            if (result instanceof Error) {
                // Remove first the .is-valid if it's exists.
                modalInput.classList.remove("is-valid");
                // Then add .is-invalid.
                modalInput.classList.add("is-invalid");
                // Display error message.
                const error = maca === '' ? new Error("Input cannot be empty!") : result;
                renderWarningMessage(error, modalBody);
                // Reset the output text.
                modalOutput.classList.remove("is-valid");
                modalOutput.value = "Output";
                break;
            }

            // Otherwise success.
            modalOutput.classList.add("is-valid");
            modalOutput.value = result.toUpperCase();
            break;
        }
        // Utilities operation.
        case "abbreviate": {
            const ipv6 = modalInput.value.toLowerCase();
            const result = Prefix.abbreviate(ipv6);

            if (result instanceof Error) {
                // Remove first the .is-valid if it's exists.
                modalInput.classList.remove("is-valid");
                // Then add .is-invalid.
                modalInput.classList.add("is-invalid");
                // Display error message.
                const error = ipv6 === '' ? new Error("Input cannot be empty!") : result;
                renderWarningMessage(error, modalBody);
                // Reset the output text.
                modalOutput.classList.remove("is-valid");
                modalOutput.value = "Output";
                break;
            }

            // Otherwise success.
            modalOutput.classList.add("is-valid");
            modalOutput.value = result.toUpperCase();
            break;
        }
        case "expand": {
            const ipv6 = modalInput.value.toLowerCase();
            const result = Prefix.expand(ipv6);

            if (result instanceof Error) {
                // Remove first the .is-valid if it's exists.
                modalInput.classList.remove("is-valid");
                // Then add .is-invalid.
                modalInput.classList.add("is-invalid");
                // Display error message.
                const error = ipv6 === '' ? new Error("Input cannot be empty!") : result;
                renderWarningMessage(error, modalBody);
                // Reset the output text.
                modalOutput.classList.remove("is-valid");
                modalOutput.value = "Output";
                break;
            }

            // Otherwise success.
            modalOutput.classList.add("is-valid");
            modalOutput.value = result.toUpperCase();
            break;
        }
        default:
            console.log("Unkown Operation!")
            break;
    }
}

export const reverseConversion = () => {
    /**
     * This function will reverse the label in conversion feature.
     */

    // Extract info from data-* attributes.
    const conversionType = modalSwitchButton.getAttribute("data-modal-operation") as string;
    const input = modalSwitchButton.getAttribute('data-input') as string;
    const output = modalSwitchButton.getAttribute('data-output') as string;
    
    // First, reset modal's content.
    resetModalContent(modalInput, modalOutput, modalBody);

    // Update modal's content.
    modalInputLabel.innerText = input;
    modalOutputLabel.innerText = output;
    
    // Tell the modal's submit button what operation to perform.
    modalSubmitButton.setAttribute("data-modal-operation", conversionType);
    
    // Reverse the data attributes for the opposite conversion.
    const conversionTypeArray = conversionType.split("-")
    modalSwitchButton.setAttribute("data-modal-operation", `${conversionTypeArray[1]}-${conversionTypeArray[0]}`);
    modalSwitchButton.setAttribute("data-input", `${output}`);
    modalSwitchButton.setAttribute("data-output", `${input}`);

    
}