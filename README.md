# SENG2021 Workshop Availability

A one-page form, hosted on GitHub Pages, where tutors mark which workshop times they can teach. Answers go to a private Google Sheet that only the sheet's owner can open.

## Connect the form to a Google Sheet (once)

1. Create a new Google Sheet. Keep it private (don't share it).
2. In the sheet, open **Extensions → Apps Script**.
3. Delete the sample code, paste in everything from [`apps-script/Code.gs`](apps-script/Code.gs), and save.
4. Click **Deploy → New deployment**, choose type **Web app**, and set:
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Click **Deploy**, approve the permission prompt, and copy the **Web app URL** (it ends in `/exec`).
6. In `index.html`, paste that URL between the quotes on the line `var ENDPOINT = "";`, then commit and push.

Until step 6 is done, the page shows a "not connected yet" notice and the save button is disabled.

## Reading the answers

Open the Google Sheet. The `Responses` tab has one row per tutor: name, an answer for each workshop time (Preferred, Can do, Can't), the most workshops they want, and a note. If a tutor saves again with the same name, their row is replaced.

## Things to know

- "Anyone" access in step 4 lets the form post answers without tutors signing in. It does not let anyone read the sheet.
- The form does not check identity. Anyone with the link can submit under any name, so treat an unexpected row with suspicion.
- If you edit `Code.gs` later, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.
