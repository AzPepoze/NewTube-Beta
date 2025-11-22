# StyleShift

**A tool to customize website appearances.**

---

## What is StyleShift?

`StyleShift` is a browser extension that lets you change how websites look and feel. With its powerful tools, you can personalize your browsing experience easily.

---

## Features

-    Customize website styles and layouts using `css` and `js` with `UI`
-    Use or create custom themes and presets
-    Export and import your designs

---

## Development for your own extension

Follow these steps to install and set up `StyleShift`:

1. **Clone the repository**:
     ```bash
     git clone https://github.com/AzPepoze/StyleShift
     ```
2. **Go to the project directory**:
     ```bash
     cd StyleShift
     ```
3. **Install the dependencies**:

     ```bash
     npm install
     ```

4. **Edit Default Items**:

     - Edit Default Items in `src > Main > Default_Items.ts`

5. **Build the project**:

     ```bash
     npm run build
     ```

     - This will create both Chrome and Firefox versions in the `out > dist` folder.

6. **Load the extension into your browser**:
     - For **Chrome**: Open `chrome://extensions/` and enable "Developer mode," then load the unpacked extension from the `out > dist > chrome` folder.
     - For **Firefox**: Open `about:debugging`, click "This Firefox," and load the extension from the `out > dist > firefox` folder.
