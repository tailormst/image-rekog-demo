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
    var reader = new FileReader();
    reader.onload = function () {
        var dataURL = reader.result;
        const base64Image = dataURL.replace(
            /^data:image\/(png|jpg|jpeg);base64,/, ""
        );

        detectImage(base64Image);
        detectFacialAttributes(base64Image);

        document
            .querySelector("#result #uploaded-image")
            .setAttribute("src", dataURL);
    };
    reader.readAsDataURL(imageFile);
}

function detectImage(base64Image) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ data: base64Image });

    var requestOptions = {
        method: "POST",
        body: raw,
        redirect: "follow",
        headers: myHeaders,
    };

    fetch("/rekognize/image", requestOptions)
        .then((response) => response.json())
        .then((result) => displayResults(result.Labels, "image", false))
        .catch((error) => displayResults(error, "image", true));
}

function detectFacialAttributes(base64Image) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ data: base64Image });

    var requestOptions = {
        method: "POST",
        body: raw,
        redirect: "follow",
        headers: myHeaders,
    };

    fetch("/rekognize/face", requestOptions)
        .then((response) => response.json())
        .then((result) => displayResults(result.FaceDetails[0], "face", false))
        .catch((error) => displayResults(error, "face", true));
}

function displayResults(data, column, error) {
    const resultDiv = document.querySelector(
        `#result #recognition-results #${column}`
    );
    if (error) {
        const errorMessage = document.createElement("div");
        errorMessage.className = `alert alert-danger`;
        errorMessage.textContent = data.message;
        resultDiv.appendChild(errorMessage);
        return;
    }

    var resArr;

    if (column === "image") {
        resArr = data.map((row) => row.Name);
        if (!resArr || resArr.length === 0) {
            resultDiv.textContent = "No deducible labels";
            return;
        }
    }

    if (column === "face") {
        if (!data) {
            resultDiv.textContent = "No deducible facial features";
            return;
        }
        resArr = [
            `Age: ${data.AgeRange.Low}-${data.AgeRange.High}`,
            `Gender: ${data.Gender.Value}`,
            `Emotion: ${data.Emotions.reduce((accumulator, current) =>
                accumulator.Confidence < current.Confidence ? current : accumulator)["Type"]}`,
            `Smiling?: ${data.Smile.Value}`,
            `Glasses?: ${data.Eyeglasses.Value || data.Sunglasses.Value}`,
        ];
    }

    resArr.forEach((res) => {
        const item = document.createElement("div");
        item.classList.add("border", "border-info", "bg-info", "bg-opacity-10", "border-info", "p-1", "w-75", "rounded", "fs-4", "m-auto", "my-2");
        item.innerText = res;
        resultDiv.appendChild(item);
    });
}

getImageData();