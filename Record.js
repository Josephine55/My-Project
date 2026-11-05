// ================= FILE STORAGE =================
let files = JSON.parse(localStorage.getItem("files")) || [];

function uploadFile() {
    const input = document.getElementById("fileInput");
    const file = input.files[0];

    if (!file) return alert("Select a file");

    const reader = new FileReader();

    reader.onload = function(e) {
        files.push({
            name: file.name,
            type: file.type,
            data: e.target.result,
            date: new Date().toLocaleString()
        });

        localStorage.setItem("files", JSON.stringify(files));
        displayFiles();
        input.value = "";
    };

    reader.readAsDataURL(file);
}

function displayFiles() {
    const table = document.getElementById("fileTable");
    table.innerHTML = "";

    files.forEach((file, i) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${file.name}</td>
            <td>${file.type}</td>
            <td>${file.date}</td>
            <td><button onclick="previewFile(${i})">Preview</button></td>
            <td><button onclick="downloadFile(${i})">Download</button></td>
            <td><button onclick="deleteFile(${i})">Delete</button></td>

        table.appendChild(row);
    });
}

// ================= PREVIEW =================
function previewFile(i) {
    const file = files[i];
    const box = document.getElementById("previewBox");
    const content = document.getElementById("previewContent");

    box.style.display = "flex";
    content.innerHTML = `<h3>${file.name}</h3>`;

    if (file.type.startsWith("image")) {
        content.innerHTML += `<img src="${file.data}" style="max-width:100%;">`;
    } else if (file.type === "application/pdf") {
        content.innerHTML += `<iframe src="${file.data}" width="100%" height="500"></iframe>`;
    } else {
        content.innerHTML += `
            <p>Preview not available.</p>
            <button onclick="downloadFile(${i})">Download File</button>
        `;
    }
}

function closePreview() {
    document.getElementById("previewBox").style.display = "none";
    document.getElementById("previewContent").innerHTML = "";
}

// Close preview when clicking outside
window.onclick = function(e) {
    const box = document.getElementById("previewBox");
    if (e.target === box) {
        closePreview();
    }
};

// ================= DOWNLOAD =================
function downloadFile(i) {
    const file = files[i];
    const a = document.createElement("a");
    a.href = file.data;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// ================= DELETE =================
function deleteFile(i) {
    if (!confirm("Delete this file?")) return;

    files.splice(i, 1);
    localStorage.setItem("files", JSON.stringify(files));
    displayFiles();
}

// ================= SUBJECTS =================
const seniorSubjects = [
"English","Mathematics","Physics","Chemistry","Biology",
"Economics","Government","Geography","Accounting","Commerce",
"Literature","Further Mathematics","Agric","Technical Drawing",
"Data Processing","Civic","French","Yoruba","Animal Husbandry","Art"
];

const juniorSubjects = [
"English","Mathematics","Basic Science","Basic Tech",
"Civic","Social Studies","Business Studies","Computer"
];

function loadSubjects() {
    const type = document.getElementById("studentType").value;
    const container = document.getElementById("subjects");
    container.innerHTML = "";

    let subjects = type === "senior" ? seniorSubjects : juniorSubjects;

    subjects.forEach(sub => addSubjectRow(sub));
}

function addSubjectRow(name="") {
    const div = document.createElement("div");
    div.className = "subject-row";

    div.innerHTML = `
        <label>${name || "New Subject"}</label>
        CA: <input type="number" class="ca" min="0" max="40">
        Exam: <input type="number" class="exam" min="0" max="60">
    `;

    document.getElementById("subjects").appendChild(div);
}

function addCustomSubject() {
    const name = prompt("Enter subject name:");
    if (name) addSubjectRow(name);
}

// ================= RESULT =================
function generateResult() {
    const name = document.getElementById("studentName").value.trim();
    const studentClass = document.getElementById("studentClass").value.trim();

    // 🔔 Reminder if name missing
    if (!name) {
        alert("Please enter student name before generating result!");
        return;
    }

    const rows = document.querySelectorAll(".subject-row");
    const table = document.getElementById("resultTable");
    const summary = document.getElementById("resultSummary");

    table.innerHTML = "";
    summary.innerHTML = "";

    let totalMarks = 0;
    let subjectCount = 0;

    rows.forEach(row => {
        const subject = row.querySelector("label").innerText;
        const ca = Number(row.querySelector(".ca").value) || 0;
        const exam = Number(row.querySelector(".exam").value) || 0;

        if (ca === 0 && exam === 0) return;

        const total = ca + exam;
        const {grade, remark} = getGrade(total);

        totalMarks += total;
        subjectCount++;

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${subject}</td>
            <td>${ca}</td>
            <td>${exam}</td>
            <td>${total}</td>
            <td>${grade}</td>
            <td>${remark}</td>
        `;

        table.appendChild(tr);
    });

    let average = subjectCount ? (totalMarks / subjectCount).toFixed(2) : 0;

    // Display summary
    summary.innerHTML = `
        <h3>Result Summary</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Class:</strong> ${studentClass}</p>
        <p><strong>Total Marks:</strong> ${totalMarks}</p>
        <p><strong>Average:</strong> ${average}</p>
    `;
}

function getGrade(score) {
    if (score >= 75) return {grade:"A", remark:"Excellent"};
    if (score >= 65) return {grade:"B", remark:"Very Good"};
    if (score >= 50) return {grade:"C", remark:"Good"};
    if (score >= 45) return {grade:"D", remark:"Credit"};
    if (score >= 40) return {grade:"E", remark:"Pass"};
    return {grade:"F", remark:"Fail"};
}

// ================= SAVE RESULT =================
function saveResult() {
    const name = document.getElementById("studentName").value.trim();

    if (!name) {
        alert("Enter student name before saving!");
        return;
    }

    const resultData = {
        name: name,
        class: document.getElementById("studentClass").value,
        summary: document.getElementById("resultSummary").innerHTML,
        table: document.getElementById("resultTable").innerHTML,
        date: new Date().toLocaleString()
    };

    let saved = JSON.parse(localStorage.getItem("studentResults")) || [];
    saved.push(resultData);

    localStorage.setItem("studentResults", JSON.stringify(saved));

    alert("Result saved successfully!");
}

// ================= DOWNLOAD RESULT =================
function downloadResult() {
    const name = document.getElementById("studentName").value.trim();

    if (!name) {
        alert("Enter student name before downloading!");
        return;
    }

    let content = `
        <h2>Student Result</h2>
        ${document.getElementById("resultSummary").innerHTML}
        <table border="1" cellspacing="0" cellpadding="5">
            <tr>
                <th>Subject</th>
                <th>CA</th>
                <th>Exam</th>
                <th>Total</th>
                <th>Grade</th>
                <th>Remark</th>
            </tr>
            ${document.getElementById("resultTable").innerHTML}
        </table>
    `;

    const blob = new Blob([content], { type: "text/html" });
    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);
    a.download = name + "_result.html";
    a.click();
}

// Load files on startup
displayFiles();