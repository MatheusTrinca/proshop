export const addDecimals = num => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = state => {
  // Calculate items price
  state.totalPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // Calculate Shipping Price
  state.shippingPrice = addDecimals(state.totalPrice > 100 ? 0 : 10);

  // Calculate Tax
  state.taxPrice = addDecimals(Number((0.15 * state.totalPrice).toFixed(2)));

  // Calculate total price
  state.totalPrice = (
    Number(state.totalPrice) +
    Number(state.taxPrice) +
    Number(state.shippingPrice)
  ).toFixed(2);

  // Save to local storage
  localStorage.setItem('cart', JSON.stringify(state));

  return state;
};
