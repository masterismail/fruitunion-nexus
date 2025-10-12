name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main # Change this if your main development branch is named differently

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      # Step 1: Check out the repository code
      - name: Checkout 🛎️
        uses: actions/checkout@v4

      # Step 2: Install dependencies and build the project
      - name: Install Dependencies and Build 🔧
        # You may need to adjust these commands if your project uses Yarn or a different build script
        run: |
          npm install
          npm run build

      # Step 3: Deploy the built files to the gh-pages branch
      - name: Deploy to Pages 🚀
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          # The branch to push the final, built code to.
          branch: gh-pages
          # The folder containing your final static files (e.g., 'build', 'dist', 'out').
          # You must check what your 'npm run build' command creates.
          folder: build