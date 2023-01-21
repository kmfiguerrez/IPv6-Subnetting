import { getPrefix, updateModalContent, modalOperation, reverseConversion } from "./controller.js";

const formButton = document.getElementById("formButton") as HTMLButtonElement;
const forms = document.querySelectorAll('form');
const formInputs = document.querySelectorAll("input[class='form-control']") as NodeListOf<HTMLInputElement>;
const subnetNumberInput = document.getElementById("subnetNumber") as HTMLInputElement;
const host = document.getElementById("host") as HTMLSpanElement;
const modalElement = document.getElementById("offcanvasModal") as HTMLDivElement;
const modalSubmitButton = document.getElementById("modal-submit-button") as HTMLButtonElement;
const modalSwitchButton = document.getElementById("modal-switch-button") as HTMLButtonElement;


// Event listeners.

// Prevent forms default.
Array.from(forms).forEach(form => {
    // Add event handlers to form elements.
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();                
    })
})

// Form inputs event.
Array.from(formInputs).forEach(input => {    
    // Add event handlers to each form input.
    input.addEventListener("change", function () {
        // Remove first the .is-invalid if it's exists.
        input.classList.remove("is-invalid");

        // Check if the input value is empty or not.
        if (this.value === "") {
            input.classList.remove("is-valid");
            input.classList.add("is-invalid");
        } else {
            input.classList.add("is-valid");
        }
    })
})

// Form submit button event.
formButton.addEventListener("click", (e) => {
    // By default, display the first subnet(subnet zero).
    
    // Reset Subnet number.
    subnetNumberInput.value = "";

    // Reset host value.
    host.innerHTML = "";

    /*
     The getPrefix() will calculate the prefix and display
     the results.
    */
    getPrefix();
})

// Subnet Input number event.
subnetNumberInput.addEventListener("change", () => {
    // Get the subnet number.
    const subnetToFind = subnetNumberInput.value;        

    // Get the prefix based on subnet number.
    getPrefix(subnetToFind);
})

// Modal event.
modalElement.addEventListener('show.bs.modal', function (event: any) {
    /*
     We used any for event param because typescript cannot read
     event interface pre-compiled create by the document.createElement 
     method.
    */

    // Link that triggered the modal    
    const link = event.relatedTarget;
    
    // Extract info from data-bs-* attributes
    // Get which modal to display and will be used as a title.
    const modalTitle = (link as HTMLAnchorElement).getAttribute('data-modal') as string;
    const inputLabel = (link as HTMLAnchorElement).getAttribute('data-input') as string;
    const outputLabel = (link as HTMLAnchorElement).getAttribute('data-output') as string;
    const modalOperation = (link as HTMLAnchorElement).getAttribute('data-modal-operation') as string;

    // Show modal's source link only in IPv6 Address type feature.
    const removeModalSourceLink = link.innerText !== "IPv6 Address Type" ? true : false;
    
    // Update the modal's content.
    updateModalContent(modalTitle, inputLabel, outputLabel, removeModalSourceLink);

    // Tell the modal's submit button what operation to perform.
    modalSubmitButton.setAttribute("data-modal-operation", modalOperation);

    // For conversion feature.
    // Set attribute for the modal's switch button to reverse conversion operation.
    if (modalTitle === "Conversions") {
        const conversionTypeArray = modalOperation.split("-");
        modalSwitchButton.setAttribute("data-modal-operation", `${conversionTypeArray[1]}-${conversionTypeArray[0]}`);
        modalSwitchButton.setAttribute("data-input", `${outputLabel}`);
        modalSwitchButton.setAttribute("data-output", `${inputLabel}`);    
    }    
  })

// Modal' swtich button event.
modalSwitchButton.addEventListener("click", () => {
    // Reverse the conversion operation.
    reverseConversion()    
})


// Modal's submit button event.
modalSubmitButton.addEventListener("click", () => {
    // Get what modal operation to perform.
    const operation = modalSubmitButton.getAttribute("data-modal-operation") as string;
    
    // Perform modal's operation.
    modalOperation(operation);
})

// const res = Prefix.ipv6_eui64("aaaa:bbbb:cccc:dddd:eeee:ffff:aaaa:bbbb", "00-11-22-33-44-55");
// const res = Prefix.eui_64("00-11-22-33-44-55")
// const res = Prefix.abbreviate("0aaa:b0bb:cc0c:dddd:eee0:ffff:aaaa:000b")
// const res = Prefix.isHex("")
// console.log(res);