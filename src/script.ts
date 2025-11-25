// 1
const topbar = document.getElementById("top");
const bottombar = document.getElementById("bottom");

if (topbar && bottombar) {
    const temp = topbar.innerHTML;
    topbar.innerHTML = bottombar.innerHTML;
    bottombar.innerHTML = temp;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "styles-script.css";
    document.head.appendChild(link);
} else {
    alert("Topbar or bottombar are not found.");
}

// 2
const a: number = 124;
const b: number = 54;
const h: number = 20;

const area: number = (a+b) / 2 * h;
const text = document.getElementById("main-text");

if (text) {
    text.innerHTML += `<br><p>Area of trapezoid where a is ${a} points, b is ${b} points and h is ${h} points equals to ${area} points.</p>`;
} else {
    alert("Tag with main text of page is not found.");
}

// 3
const MIN_NUMBER_LIMIT = 0;
const MAX_NUMBER_LIMIT = 1_000_000;

function* getDivisors(value: number): Generator<number> {
    if (value <= 0) return;
    yield 1;

    const start: number = value % 2 !== 0 ? 2 : 3;
    const step: number = value % 2 !== 0 ? 1 : 2;

    for (let i: number = start; i < value / 2; i += step) {
        if (value % i === 0) yield i;
    }
    yield value;
}

class Cookie {
    private name: string;
    constructor(name: string) {
        this.name = encodeURIComponent(name);
    }

    set value(data: string | number | boolean) {
        document.cookie = `${this.name}=${encodeURIComponent(data)}`;
    }

    get value(): string | undefined {
        const cookies: string[] = document.cookie.split("; ");
        for (const value of cookies) {
            const [key, val] = value.split(/=(.+)/);
            if (key === this.name) return decodeURIComponent(val);
        }
        return undefined;
    }

    delete(): void {
        document.cookie = `${this.name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    }

    exists(): boolean {
        const getValue = this.value;
        return getValue !== undefined && getValue !== "";
    }
}

const cookieForm = document.getElementById('cookieForm') as HTMLFormElement;
const cookieNumber = new Cookie("number");
const cookieDivisorsNumbers = new Cookie("divisorsNumbers");

if (cookieNumber.exists() && cookieDivisorsNumbers.exists()) {
    alert(`Number is ${cookieNumber.value}\nDivisors: ${cookieDivisorsNumbers.value}`);

    const question = confirm("Would you like to continue saving cookies?");
    if (!question) {
        cookieNumber.delete();
        cookieDivisorsNumbers.delete();
        alert("Cookies are deleted. Reload the page to see changes");
    }
} else {
    cookieForm.style.display = "initial";
    cookieForm?.addEventListener("submit", function(event) {
        event.preventDefault();
        const value: number = Number(cookieForm.inputNumber.value);
        
        if (value > MIN_NUMBER_LIMIT && value < MAX_NUMBER_LIMIT) {
            const stringifiedNumbers: string = JSON.stringify([...getDivisors(value)]);
            alert(`Number is ${value}\nDivisors: ${stringifiedNumbers}`);

            const question = confirm("Would you like to save cookies?");
            if (question) {
                cookieForm.style.display = "none";
                cookieNumber.value = value;
                cookieDivisorsNumbers.value = stringifiedNumbers;
                alert("Cookies are saved. You can reload the page to check this");
            } else {
                alert("Cookies will not be saved");
            }
        } else {
            alert("Number must be in range [1; 10000]");
        }
    });
}

// 4
const form = document.getElementById("localStorageForm") as HTMLFormElement;
const rightbar = document.getElementById("right") as HTMLElement;

const savedStyle = localStorage.getItem("textTransform");
if (savedStyle) {
    rightbar.style.textTransform = savedStyle;
    const savedRadio = form.querySelector(`input[value="${savedStyle}"]`) as HTMLInputElement;
    if (savedRadio) savedRadio.checked = true;
}

form.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;
    if (target.name === "choice") {
        rightbar.style.textTransform = target.value;
        localStorage.setItem("textTransform", target.value);
    }
});

// 5
const imageStorageName: string = "images";
class ImageManager {
    readonly imageBlockElement: HTMLDivElement;
    readonly formElement: HTMLFormElement;
    readonly imageElement: HTMLInputElement;

    constructor() {
        const formElement = document.getElementById("localStorageImageForm") as HTMLFormElement;
        if (!formElement) {
            throw new Error("Form with id 'localStorageImageForm' not found");
        }
        this.formElement = formElement as HTMLFormElement;

        const imageElement = document.getElementById("image");
        if (!imageElement) {
            throw new Error("Input with id 'image' not found");
        }
        this.imageElement = imageElement as HTMLInputElement;

        const imageBlockElement = document.getElementById("images-block");
        if (!imageBlockElement) {
            throw new Error("Block with id 'images-block' is not found");
        }
        this.imageBlockElement = imageBlockElement as HTMLDivElement;

        if (!localStorage.getItem(imageStorageName)) {
            localStorage.setItem(imageStorageName, JSON.stringify([]));
        }

        this.updateHTMLImages();
        this.addImageListener();
        this.deleteImageListener();
    }

    private updateHTMLImages() {
        const images = localStorage.getItem(imageStorageName);
        if (images) {
            this.imageBlockElement.innerHTML = "";
            const imagesParsed: string[] = JSON.parse(images);
            imagesParsed.forEach((image, index) => {
                this.imageBlockElement.insertAdjacentHTML('beforeend', `<div class="image-element"><img src="${image}" alt="Image_${index + 1}"><button data-item-id="${index}">Delete image ${index + 1}</button></div>`);
            });
        }
    }
    
    private addImageListenerHandler(event: SubmitEvent) {
        event.preventDefault();

        if (this.imageElement.files && this.imageElement.files.length > 0) {
            const file = this.imageElement.files[0];
            const reader = new FileReader();

            reader.onload = () => {
                const base64String = reader.result as string;
                if (base64String) {
                    const savedImages: string | null = localStorage.getItem(imageStorageName);
                    if (savedImages !== null) {
                        try {
                            const savedImagesParsed = JSON.parse(savedImages);
                            savedImagesParsed.push(base64String);
                            localStorage.setItem(imageStorageName, JSON.stringify(savedImagesParsed));

                            this.imageElement.value = "";
                            this.updateHTMLImages();
                        } catch (error) {
                            console.error("Parsing error savedImages:", error);
                        }
                    }
                }
            };
            reader.readAsDataURL(file);
        } else {
            alert("Images are not selected!");
        }
    }
    
    private deleteImageListenerHandler(event: PointerEvent) {
        event.preventDefault();

        const target = event.target as HTMLElement;
        if (target.tagName === "BUTTON") {
            const images = localStorage.getItem(imageStorageName);
            const imageID = target.getAttribute("data-item-id");
            if (images && imageID) {
                const imagesParsed: string[] = JSON.parse(images);
                imagesParsed.splice(Number(imageID), 1);
                localStorage.setItem(imageStorageName, JSON.stringify(imagesParsed));
                this.updateHTMLImages();
            }
        }
    }

    private addImageListener() {
        this.formElement.addEventListener("submit", this.addImageListenerHandler.bind(this));
    }

    private deleteImageListener() {
        this.imageBlockElement.addEventListener("click", this.deleteImageListenerHandler.bind(this));
    }
}

const imageManager = new ImageManager();

const formAddButton = document.getElementById("header_button");
formAddButton?.addEventListener("click", function() {
    imageManager.formElement.style.display = "initial";
})