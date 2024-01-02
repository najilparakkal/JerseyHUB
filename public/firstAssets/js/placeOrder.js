// Make sure to include the Razorpay library in your HTML before this script




document.getElementById('placeOrderButton').addEventListener('click', async () => {
  try {
      const selectedAddressId = document.querySelector('input[name="selectedAddressId"]:checked').value;
      const paymentMethod = document.querySelector('input[name="payment_option"]:checked').value;
      const grandTotal = document.getElementById("grandTotal").value;
      const sizeElement = document.getElementById("size");
      const size = sizeElement.textContent.trim().replace(/\n/g, '');
              

      const payload = {
          selectedAddressId,
          paymentMethod,
          grandTotal:grandTotal,
          size
      };
      if (paymentMethod === "COD") {
          const response = await fetch("/placeOrder", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(payload),
          });

          if (response.ok) {
              console.log("COD success");
              // Redirect or perform success action
          } else {
              console.log("Failed....");
              // Handle failure
          }
      } else if (paymentMethod === "razorpay") {
        const response = await fetch("/placeOrder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (response.status === 201) {
          const resData = await response.json();
          const options = {
            key: "rzp_test_P8THlp76qwLW4O",
            amount: resData.order.amount,
            currency: resData.order.currency,
            name: "Jersey HUB",
            description: "Test Transaction",
            order_id: resData.order.id,
            handler: async function (response) {
              
              await fetch("/razorpay",{
                method:"POST",
                headers:{
                  "Content-Type":"application/json",
                },
                body:JSON.stringify(payload)
              });

              window.location.href = "/orders";

            }
          };
          var razorpay = new Razorpay(options);
          razorpay.open();
        }
      
      }else if (paymentMethod === 'Wallet') {
        const response = await fetch("/placeOrder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        
        if (response.status === 200) {
          const resData = await response.json();
  
          const walletResponse = await fetch("/wallet", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
  
          if (walletResponse.status === 200) {
            Swal.fire({
              icon: 'question',
              title: 'Confirm Order',
              text: 'Are you sure you want to place this order?',
              showCancelButton: true,
              confirmButtonText: 'Yes',
              cancelButtonText: 'No',
            }).then((result) => {
              if (result.isConfirmed) {
        
                Swal.fire({
                  icon: 'success',
                  title: 'Order Confirmed!',
                  text: 'Your order has been successfully placed.',
                }).then(() => {
                  window.location.href = '/orders';
                });
              } 
            });
          } else if (walletResponse.status === 501) {
            Swal.fire('Error', 'Insufficient wallet balance.', 'error');
          } else {
            console.error('Failed to place order using wallet');
            Swal.fire('Error', 'Failed to place order using wallet.', 'error');
          }
        }else if(response.status === 501){
          Swal.fire('Error', 'Insufficient wallet balance.', 'error');

        } else {
          console.error('Failed to place order');
        }
      }
    } catch (err) {
      console.log(err);
      Swal.fire("ERROR,'Youn Missed Somthing'");
    }
  });


function confirmPlaceOrder() {
    const selectedAddressId = document.querySelector('input[name="selectedAddressId"]:checked');
    const paymentMethod = document.querySelector('input[name="payment_option"]:checked');
    const grandTotel = document.getElementById("grandTotal").value
    const size = document.getElementById("size").value;

  console.log(size,"❤️❤️❤️❤️");

    if (!selectedAddressId || !paymentMethod) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please select an address and payment method!',
      });
      return;
    }
  
    Swal.fire({
      icon: 'question',
      title: 'Confirm Order',
      text: 'Are you sure you want to place this order?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {

        Swal.fire({
          icon: 'success',
          title: 'Order Confirmed!',
          text: 'Your order has been successfully placed.',
        }).then(() => {
          // Redirect to the order details page
          window.location.href = '/orders';
        });
      } 
    });
  }