var globalWarnItems = new Array();

function addTooltip () {    
    console.log("addTooltip >>> start");
    // create a new div element 
    var newDiv = document.createElement("div"); 
    // var css = document.createAttribute("class");
    // css.value = "sfcc_bm_powerup_tooltip";
    newDiv.setAttribute("class", "sfcc_bm_powerup_tooltip");
    // and give it some content 
    var newContent = document.createTextNode("Power up Packs enabled!"); 
    // add the text node to the newly created div
    newDiv.appendChild(newContent);
    document.body.appendChild(newDiv);
    console.log("addTooltip >>> end");
}

function getLimitedReplicationItmes () {
    return [
        "input[type=checkbox][value$=_ORGANIZATION_CSC_SETTINGS]",
        "input[type=checkbox][value$=_ORGANIZATION_CSRF_WHITELIST_PIPELINES]",
        "input[type=checkbox][value$=_ORGANIZATION_CATALOG]",
        "input[type=checkbox][value$=_ORGANIZATION_TYPE_DEFINITION]",
        "input[type=checkbox][value$=_ORGANIZATION_CUSTOM_OBJECT]",
        "input[type=checkbox][value$=_ORGANIZATION_CUSTOMERLIST]",
        "input[type=checkbox][value$=_ORGANIZATION_REFERENCE_DATA]",
        "input[type=checkbox][value$=_ORGANIZATION_SORTING]",
        "input[type=checkbox][value$=_ORGANIZATION_OAUTH_PROVIDERS]",
        "input[type=checkbox][value$=_ORGANIZATION_OCAPI_SETTINGS]",
        "input[type=checkbox][value$=_ORGANIZATION_PAGE_META_TAGS]",
        "input[type=checkbox][value$=_ORGANIZATION_PREFERENCE]",
        "input[type=checkbox][value$=_ORGANIZATION_PREFERENCE_SYSTEM]",
        "input[type=checkbox][value$=_ORGANIZATION_PREFERENCE_CUSTOM]",
        "input[type=checkbox][value$=_ORGANIZATION_PRICE_BOOK]",
        "input[type=checkbox][value$=_ORGANIZATION_SITE]",
        "input[type=checkbox][value$=_SITE]",
        "input[type=checkbox][value$=_ORGANIZATION_STATIC_CONTENT]",
        "input[type=checkbox][value$=_ORGANIZATION_WEBDAV_CLIENT_PERMISSIONS]",
        "input[type=checkbox][value$=_SITE_ABTEST_ONLY]",
        "input[type=checkbox][value$=_SITE_ABTEST]",
        "input[type=checkbox][value$=_SITE_ACTIVEDATAFEED]",
        "input[type=checkbox][value$=_SITE_CACHE_SETTINGS]",
        "input[type=checkbox][value$=_SITE_CUSTOM_OBJECT]",
        "input[type=checkbox][value$=_SITE_DYNAMIC]",
        "input[type=checkbox][value$=_SITE_OCAPI_SETTINGS]",
        "input[type=checkbox][value$=_SITE_PAYMENT_METHOD]",
        "input[type=checkbox][value$=_SITE_PREFERENCE]",
        "input[type=checkbox][value$=_SITE_PREFERENCE_SYSTEM]",
        "input[type=checkbox][value$=_SITE_PREFERENCE_CUSTOM]"    
    ];    
}

function warnReplication () {
    console.log("warnReplication >>> start");
    var href = window.location.href;
    if (href.indexOf("ViewReplicationProcessWizard-Dispatch") > -1) {
        alert("Do NOT replicate locked options! If locked option is needed to be replicated, please create support ticket in jira APACDW project!");
        createUnlockButton();

        var warnItems = getLimitedReplicationItmes();
        for (let j = 0; j < warnItems.length; j++) {
            console.log("working on item: " + warnItems[j]);
            warnReplicationItems(warnItems[j]);
        }
        warnReplicationMasterCatalogs();
    }
    console.log("warnReplication >>> end");
}

function warnDefaultLocale () {
    console.log("warnDefaultLocale >>> start");
    var href = window.location.href;
    
    // Product detail
    if (href.indexOf("ViewProduct") > -1) {
        var localeSelector = document.querySelector('select[name=LocaleID]');
        var selectedLocale = localeSelector.options[localeSelector.selectedIndex].value;
        var lockStatus = document.querySelectorAll(".lockedit_icon img").length > 0;
        if (!!lockStatus) {            
            if ("default" == selectedLocale) {
                alert("Please do NOT edit items under DEFAULT LOCALE! If default locale modification is needed to be replicated, please create support ticket in jira APACDW project!");
                createWarnningOnDefaultLocale();
                createWarnningAlertWhenSubmit();
            }
            
            lockDefaultProductOnlineValues();
        }
    }
    console.log("warnDefaultLocale >>> end");
}

function createWarnningOnDefaultLocale () {
    console.log("createWarnningOnDefaultLocale >>> start");
    var warningMessage = "Please do NOT edit items under DEFAULT LOCALE! If default locale modification is needed to be replicated, please create support ticket in jira APACDW project!";

    var editSiteSpecific = document.querySelector('.not_disabled_loc');
    var warningText = document.createElement("span");
    warningText.appendChild(document.createTextNode(warningMessage));
    warningText.className = "sfcc_bm_powerup_default_locale_warn_text";
    editSiteSpecific.parentNode.appendChild(warningText);

    var bottomApplyButton = document.querySelectorAll('button.apply')[1];
    var bottomWarning = document.createElement("span");
    bottomWarning.appendChild(document.createTextNode(warningMessage));
    bottomWarning.className = "sfcc_bm_powerup_default_locale_warn_text_bottom";
    bottomApplyButton.parentNode.insertBefore(bottomWarning, bottomApplyButton);
    console.log("createWarnningOnDefaultLocale >>> end");
}

function createWarnningAlertWhenSubmit () {
    console.log("createWarnningAlertWhenSubmit >>> start");
    var applyButtons = document.querySelectorAll('button.apply');
    for (let m = 0; m < applyButtons.length; m++) {
        applyButtons[m].addEventListener('click', warnningOnSubmitting);
    }
    console.log("createWarnningAlertWhenSubmit >>> end");
}

function warnningOnSubmitting () {
    if(!confirm("You are submiiting changes on DEFAULT locale and may impact other countries, do you REALLY want to continue??")) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
}

function warnReplicationItems (cssSelector) {
    var items = document.querySelectorAll(cssSelector);    
    for (let i = 0; i < items.length; i++) {
        items[i].disabled = true;
        items[i].parentNode.parentNode.className += " sfcc_bm_powerup_warning";
        globalWarnItems.push(items[i]);
    }
}

function warnReplicationMasterCatalogs() {
    var catalogs = document.querySelectorAll("input[type=checkbox][value$=CATALOG]");   
    var parentTR = null;
    for (let k = 0; k < catalogs.length; k++) {
        if (catalogs[k].parentNode.parentNode.querySelector(".infobox_title").innerText.indexOf('-master') > -1 ||
            catalogs[k].parentNode.parentNode.querySelector(".infobox_title").innerText.indexOf('CustomerFileStore') > -1 ) {
            catalogs[k].disabled = true;
            catalogs[k].parentNode.parentNode.className += " sfcc_bm_powerup_warning";
            globalWarnItems.push(catalogs[k]);
        }
    }
}

function createUnlockButton () {    
    var expendButton = document.querySelector("#ExpandAll");
    var unlockButton = document.createElement("a"); 
    unlockButton.appendChild(document.createTextNode("Do NOT replicate locked options! If locked option is needed to be replicated, please create support ticket in jira APACDW project!"));
    //unlockButton.addEventListener('click', unlockPreferences);
    unlockButton.addEventListener('click', raiseJiraTicket);
    unlockButton.className = "sfcc_bm_powerup_unlock_preferences";
    expendButton.parentNode.appendChild(unlockButton);
}

function raiseJiraTicket() {
    if (window.confirm("Do you want to raise JIRA ticket to replicate locked items??")) {
        window.location = "https://jira.e-loreal.com/secure/CreateIssueDetails!init.jspa?pid=40307&issuetype=15101&priority=5&description=*Due+time*(Date%2fTime%2fTimezone)%3a%0A-%0A*Request+details*%0A+%23+%c2%a0%0A+%23+";
    }
}

function unlockPreferences() {
    if (window.confirm("Click 'OK' means you understood the risk to crash target server, please make sure get approval from LOREAL APAC IT!")) {
        if (window.confirm("Do you REALLY need replicate those sensitive items?")) {
            for (let i = 0; i < globalWarnItems.length; i++) {
                globalWarnItems[i].disabled = false;
            }
            var unlockButton = document.querySelector(".sfcc_bm_powerup_unlock_preferences");
            unlockButton.textContent = ">>> WARNING <<<, UNLOCKED sensitive replication items, eyes on you."
            unlockButton.className += " sfcc_bm_powerup_unlocked";
            unlockButton.removeEventListener('click', unlockPreferences, false);
        }
    }
}

function lockDefaultProductOnlineValues() {
    console.log("lockDefaultProductOnlineValues >>> start");
    // data-dw-tooltip="Product.onlineFlag"
    var onlineFlag = document.querySelector("span[data-dw-tooltip='Product.onlineFlag']");
    var onlineFromFlag = document.querySelector("span[data-dw-tooltip='Product.onlineFrom']");
    var onlineToFlag = document.querySelector("span[data-dw-tooltip='Product.onlineTo']");
    lockProductOnlineSelector(onlineFlag);
    lockProductOnlineInput(onlineFromFlag);
    lockProductOnlineInput(onlineToFlag);
    console.log("lockDefaultProductOnlineValues >>> end");
}

function lockProductOnlineSelector(flag) {
    flag.className += " sfcc_bm_powerup_online_flag";
    var selectors = flag.closest('.top').parentNode.querySelectorAll("select");
    var localeSelector = selectors[0];
    var defaultOption = localeSelector.children[0];
    defaultOption.innerText += " (LOCKED)"
    if (!!defaultOption.selected) {
        for (let n = 0; n < selectors.length; n++) {
            if (n == 0) {
                continue;
            }
            selectors[n].disabled = true;
        }
    }
    // localeSelector.addEventListener('change', disableProductOnlineValue);
}

function lockProductOnlineInput(flag) {
    flag.className += " sfcc_bm_powerup_online_flag";
    var selectors = flag.closest('.top').parentNode.querySelectorAll("select");
    var localeSelector = selectors[0];
    var defaultOption = localeSelector.children[0];
    defaultOption.innerText += " (LOCKED)"
    if (!!defaultOption.selected) {
        var inputs = flag.closest('.top').parentNode.querySelectorAll("input[type=text]");
        var buttons = flag.closest('.top').parentNode.querySelectorAll("button");
        for (let o = 0; o < inputs.length; o++) {
            inputs[o].disabled = true;
        }
        for (let m = 0; m < buttons.length; m++) {
            buttons[m].disabled = true;
        }
    }
    // localeSelector.addEventListener('change', disableProductOnlineValue);
}

function disableProductOnlineValue(event) {
    // console.log(event);
}

function showTOTP() {

}

// executions
addTooltip();
warnReplication();
warnDefaultLocale();
showTOTP();