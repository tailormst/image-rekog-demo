function getImageData() {
    document
        .querySelector("#image-upload")
        .addEventListener("change", function (event) {
            document.querySelector(
                "#result #recognition-results #image"
            ).innerHTML = ``;
            document.querySelector(
                "#result #recognition-results #face"
            ).innerHTML = ``;
            document.querySelector("#result").style.display = "block";
            processImage(event.target.files[0]);
        });
}

function processImage(imageFile) {
    let reader = new FileReader();
    reader.onload = function () {
        let dataURL = reader.result;
        const base64Image = dataURL.replace(
            /^data:image\/(png|jpg|jpeg);base64,/,
            ""
        );

        // Clear previous results
        document.querySelector(
            "#result #recognition-results #image"
        ).innerHTML = ``;
        document.querySelector(
            "#result #recognition-results #face"
        ).innerHTML = ``;

        detectImage(base64Image);
        detectFacialAttributes(base64Image);

        document
            .querySelector("#result #uploaded-image")
            .setAttribute("src", dataURL);
    };
    reader.readAsDataURL(imageFile);
}

function detectImage(base64Image) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({ data: base64Image });

    let requestOptions = {
        method: "POST",
        body: raw,
        redirect: "follow",
        headers: myHeaders,
    };

    fetch("/rekognize/image", requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((result) => displayResults(result.Labels, "image", false))
        .catch((error) => displayResults({ message: error.message }, "image", true));
}

function detectFacialAttributes(base64Image) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({ data: base64Image });

    let requestOptions = {
        method: "POST",
        body: raw,
        redirect: "follow",
        headers: myHeaders,
    };

    fetch("/rekognize/face", requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((result) => displayResults(result.FaceDetails?.[0], "face", false))
        .catch((error) => displayResults({ message: error.message }, "face", true));
}

function displayResults(data, column, error) {
    const resultDiv = document.querySelector(
        `#result #recognition-results #${column}`
    );
    if (error) {
        const errorMessage = document.createElement("div");
        errorMessage.className = `alert alert-danger`;
        errorMessage.textContent = data.message || "An error occurred.";
        resultDiv.appendChild(errorMessage);
        return;
    }

    let resArr = [];

    if (column === "image" && Array.isArray(data)) {
        resArr = data.map((row) => row.Name);
        if (resArr.length === 0) {
            resultDiv.textContent = "No deducible labels.";
            return;
        }
    }

    if (column === "face") {
        if (!data) {
            resultDiv.textContent = "No deducible facial features.";
            return;
        }
        resArr = [
            data.AgeRange
                ? `Age: ${data.AgeRange.Low}-${data.AgeRange.High}`
                : "Age: Not Available",
            data.Gender
                ? `Gender: ${data.Gender.Value}`
                : "Gender: Not Available",
            data.Emotions && data.Emotions.length > 0
                ? `Emotion: ${data.Emotions.reduce((acc, current) =>
                    acc.Confidence < current.Confidence ? current : acc
                )["Type"]}`
                : "Emotion: Not Available",
            `Smiling?: ${data.Smile?.Value || "Not Available"}`,
            `Glasses?: ${
                data.Eyeglasses?.Value || data.Sunglasses?.Value || "No"
            }`,
        ];
    }

    resArr.forEach((res) => {
        const item = document.createElement("div");
        item.classList.add(
            "border",
            "border-info",
            "bg-info",
            "bg-opacity-10",
            "p-1",
            "w-75",
            "rounded",
            "fs-4",
            "m-auto",
            "my-2"
        );
        item.innerText = res;
        resultDiv.appendChild(item);
    });
}

getImageData();
