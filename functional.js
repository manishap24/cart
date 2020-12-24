var shoppingCart = (function() {
  cart = [];
  function Item(name, price, count, discount) {
    this.name = name;
    this.price = price;
    this.count = count;
	this.discount = discount;
  }
  function saveCart() {
    sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
  }
  function loadCart() {
    cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
  }
  if (sessionStorage.getItem("shoppingCart") != null) {
    loadCart();
  }
  var obj = {};
  obj.addItemToCart = function(name, price, discount, count) {
    for(var item in cart) {
      if(cart[item].name === name) {
        cart[item].count ++;
		cart[item].discount =+ cart[item].discount;
        saveCart();
        return;
      }
    }
    var item = new Item(name, price, count, discount);
    cart.push(item);
    saveCart();
  }
  obj.setCountForItem = function(name, count) {
    for(var i in cart) {
      if (cart[i].name === name) {
        cart[i].count = count;
        break;
      }
    }
  };
  // Remove item from cart
  obj.removeItemFromCart = function(name) {
      for(var item in cart) {
        if(cart[item].name === name) {
          cart[item].count --;
          if(cart[item].count === 0) {
            cart.splice(item, 1);
          }
          break;
        }
    }
    saveCart();
  }
  obj.removeItemFromCartAll = function(name) {
    for(var item in cart) {
      if(cart[item].name === name) {
        cart.splice(item, 1);
        break;
      }
    }
    saveCart();
  }
  obj.clearCart = function() {
    cart = [];
    saveCart();
  }
  obj.totalCount = function() {
    var totalCount = 0;
    for(var item in cart) {
      totalCount += cart[item].count;
    }
    return totalCount;
  }
   obj.totalDiscount = function() {
    var totalDiscount = 0;
    for(var item in cart) {
      totalDiscount += cart[item].discount;
    }
    return totalDiscount;
  }
  obj.totalCart = function() {
    var totalCart = 0;
    for(var item in cart) {
      totalCart += cart[item].price * cart[item].count;
    }
    return Number(totalCart.toFixed(2));
  }
  obj.listCart = function() {
    var cartCopy = [];
    for(i in cart) {
      item = cart[i];
      itemCopy = {};
      for(p in item) {
        itemCopy[p] = item[p];

      }
      itemCopy.total = Number(item.price * item.count).toFixed(2);
      cartCopy.push(itemCopy)
    }
    return cartCopy;
  }
  return obj;
})();
function addtoCart(cartdata){
	var name = cartdata.getAttribute('data-name');
	var price = Number(cartdata.getAttribute('data-price'));
	var discount = Number(cartdata.getAttribute('data-discount'));
  shoppingCart.addItemToCart(name, price, discount, 1);
  displayCart();
  var addedCart =''
  addedCart +='<p>'+ name +' added to the cart <a class="close btn btn-danger" href="" data-dismiss="toast" aria-label="Close">Close</a></p>';
  $('#product_name').html(addedCart)
  $('#toast').toast('show')
}
$('.clear-cart').click(function() {
  shoppingCart.clearCart();
  displayCart();
});
function displayCart() {
  var cartArray = shoppingCart.listCart();
  var output = "";
  for(var i in cartArray) {
    output += "<tr style='vertical-align: middle'>"
      + "<td>" + cartArray[i].name + "</td>" 
      + "<td><div class='input-group'><button class='minus-item input-group-addon btn btn-primary' data-name=" + cartArray[i].name + ">-</button>"
      + "<input type='number' class='item-count form-control' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "'>"
      + "<button class='plus-item btn btn-primary input-group-addon' data-name=" + cartArray[i].name + ">+</button></div></td>"
      + "<td><button class='delete-item btn btn-danger' data-name=" + cartArray[i].name + ">X</button></td>"
      + " = " 
      + "<td> $" + cartArray[i].total + "</td>" 
      +  "</tr>";
  }
  $('#carttable').html(output);
  $('.total-cart').html('$'+ shoppingCart.totalCart());
  $('.total-count').html(shoppingCart.totalCount());
  $('.discount-cart').html('-$'+shoppingCart.totalDiscount());
  var ordertotal = shoppingCart.totalCart() - shoppingCart.totalDiscount()

  $('.total-order').html('$'+ ordertotal);
  $('.total-discount').html('-$0');
}
$('.show-cart').on("click", ".delete-item", function(event) {
  var name = $(this).data('name')
  shoppingCart.removeItemFromCartAll(name);
  displayCart();
})
$('.show-cart').on("click", ".minus-item", function(event) {
  var name = $(this).data('name')
  shoppingCart.removeItemFromCart(name);
  displayCart();
})
$('.show-cart').on("click", ".plus-item", function(event) {
  var name = $(this).data('name')
  shoppingCart.addItemToCart(name);
  displayCart();
})
$('.show-cart').on("change", ".item-count", function(event) {
   var name = $(this).data('name');
   var count = Number($(this).val());
  shoppingCart.setCountForItem(name, count);
  displayCart();
});

displayCart();
