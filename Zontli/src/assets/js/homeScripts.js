function action() {
    alert("JAS");
    const accountForm = document.createElement("div");
    const form = document.createElement("form");

    accountForm.style.fontFamily = '"Roboto", sans-serif';
    accountForm.style.position = "fixed";
    accountForm.style.backgroundColor = "#cacaca";
    accountForm.style.width = "100%";
    accountForm.style.height = "100vh";
    accountForm.style.display = "flex";
    accountForm.style.justifyContent = "center";
    accountForm.style.alignItems = "center";
    accountForm.style.top = "0";
    accountForm.style.left = "0";
    accountForm.style.zIndex = "50";

    const button = document.createElement("button");

    form.innerHTML = `
        <style>
            .createNewAccountForm {
            width: 500px;
            display: flex;
            flex-direction: column;
            padding: 12px;
            justify-content: center;
            align-items: start;
            background-color: white;
            border-radius: 10px;
            box-shadow: 5px 5px 10px rgb(43, 43, 43);
            }

            .newAccountItem {
            margin: 8px 0;
            padding: 10px;
            border: none;
            border-radius: 5px;
            width: 100%;
            background-color: #dddddd;
            }

            .newAccountItem:focus {
            outline: none;
            box-shadow: 2px 3px 5px #363636;
            background-color: #cecece;
            }
        </style>
        <h3>Add New Account</h3>
        <select name="accountType" id="accountType" class="newAccountItem">
            <option value="" selected>Choose Account Type...</option>
            <option value="checking">Checking Account</option>
            <option value="savings">Savings Account</option>
        </select>
        <input type="number" name="balance" id="balance" placeholder="Initial Balance" class="newAccountItem" />
        <button type="submit" class="newAccountItem">Create</button>
    `;

    document.body.appendChild(accountForm);
    accountForm.append(form);
}