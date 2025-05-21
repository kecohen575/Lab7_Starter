describe('Basic user flow for Website', () => {
  // First, visit the lab 7 website
  beforeAll(async () => {
    await page.goto('https://cse110-sp25.github.io/CSE110-Shop/');
  });

  // Each it() call is a separate test
  // Here, we check to make sure that all 20 <product-item> elements have loaded
  it('Initial Home Page - Check for 20 product items', async () => {
    console.log('Checking for 20 product items...');

    // Query select all of the <product-item> elements and return the length of that array
    const numProducts = await page.$$eval('product-item', (prodItems) => {
      return prodItems.length;
    });

    // Expect there that array from earlier to be of length 20, meaning 20 <product-item> elements where found
    expect(numProducts).toBe(20);
  });

  // Check to make sure that all 20 <product-item> elements have data in them
  // We use .skip() here because this test has a TODO that has not been completed yet.
  // Make sure to remove the .skip after you finish the TODO. 
  it('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');

    // Start as true, if any don't have data, swap to false
    let allArePopulated = true;

    // Query select all of the <product-item> elements
    const prodItemsData = await page.$$eval('product-item', prodItems => {
      return prodItems.map(item => {
        // Grab all of the json data stored inside
        return data = item.data;
      });
    });

    console.log(`Checking product item 1/${prodItemsData.length}`);

    // Make sure the title, price, and image are populated in the JSON
    for (let i = 0; i < prodItemsData.length; i++) {
      const data = prodItemsData[i];
      if (!data.title || data.title.length === 0) allArePopulated = false;
      if (!data.price || data.price.length === 0) allArePopulated = false;
      if (!data.image || data.image.length === 0) allArePopulated = false;
    }

    expect(allArePopulated).toBe(true);

  }, 10000);

  // Check to make sure that when you click "Add to Cart" on the first <product-item>
  // that the button swaps to "Remove from Cart"
  it('Clicking the "Add to Cart" button should change button text', async () => {
    console.log('Checking the "Add to Cart" button...');
    // Step 2: click first item’s button via shadowRoot
    await page.$eval('product-item', item =>
      item.shadowRoot.querySelector('button').click()
    );
    // Verify text changed
    const btnText = await page.$eval(
      'product-item',
      item => item.shadowRoot.querySelector('button').innerText
    );
    expect(btnText).toBe('Remove from Cart');
  }, 5000);

  // Check to make sure that after clicking "Add to Cart" on every <product-item>
  // that the Cart number in the top right has been correctly updated
  it('Checking number of items in cart on screen', async () => {
    console.log('Checking number of items in cart on screen...');
    // Step 3: click all remaining "Add to Cart" buttons
    await page.$$eval('product-item', items => {
      items.forEach(item => {
        const btn = item.shadowRoot.querySelector('button');
        if (btn.innerText === 'Add to Cart') {
          btn.click();
        }
      });
    });
    // Verify cart count is 20
    const count = await page.$eval('#cart-count', el => el.innerText);
    expect(count).toBe('20');
  }, 15000);

  // Check to make sure that after you reload the page it remembers all of the items in your cart
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');
    // Step 4: reload and verify all buttons read "Remove from Cart"
    await page.reload();
    const allRemoved = await page.$$eval('product-item', items =>
      items.every(item =>
        item.shadowRoot.querySelector('button').innerText === 'Remove from Cart'
      )
    );
    expect(allRemoved).toBe(true);
    // And cart count stays at 20
    const count = await page.$eval('#cart-count', el => el.innerText);
    expect(count).toBe('20');
  }, 10000);

  // Check to make sure that the cart in localStorage is what you expect
  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage for cart contents...');
    // Step 5: localStorage.cart should be [1…20]
    const cart = await page.evaluate(() => localStorage.getItem('cart'));
    expect(cart).toBe(
      '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]'
    );
  });

  // Checking to make sure that if you remove all of the items from the cart
  // that the cart number in the top right of the screen is 0
  it('Checking number of items in cart on screen after removing from cart', async () => {
    console.log('Removing all items from cart...');
    // Step 6: click every "Remove from Cart" button
    await page.$$eval('product-item', items => {
      items.forEach(item => {
        const btn = item.shadowRoot.querySelector('button');
        if (btn.innerText === 'Remove from Cart') {
          btn.click();
        }
      });
    });
    // Verify count goes to 0
    const count = await page.$eval('#cart-count', el => el.innerText);
    expect(count).toBe('0');
  }, 10000);

  // Checking to make sure that it remembers us removing everything from the cart
  // after we refresh the page
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking empty cart after reload...');
    // Step 7: reload, ensure every button reads "Add to Cart"
    await page.reload();
    const allAdded = await page.$$eval('product-item', items =>
      items.every(item =>
        item.shadowRoot.querySelector('button').innerText === 'Add to Cart'
      )
    );
    expect(allAdded).toBe(true);
    // Cart count stays at 0
    const count = await page.$eval('#cart-count', el => el.innerText);
    expect(count).toBe('0');
  }, 10000);

  // Checking to make sure that localStorage for the cart is as we'd expect for the
  // cart being empty
  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking localStorage is empty...');
    // Step 8: localStorage.cart should now be []
    const cart = await page.evaluate(() => localStorage.getItem('cart'));
    expect(cart).toBe('[]');
  });
});
