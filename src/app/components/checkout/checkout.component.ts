import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ShopFormService } from '../../services/shop-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { ShopValidators } from '../../validators/shop-validators';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  Countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private shopFormService: ShopFormService,
    private cartService : CartService
  ) {}

  ngOnInit(): void {

    this.reviewCartDetails();



    this.checkoutForm = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });

    const startMonth: number = new Date().getMonth() + 1;
    this.shopFormService
      .getCreditCardMonths(startMonth)
      .subscribe((data) => (this.creditCardMonths = data));

    this.shopFormService
      .getCreditCarYears()
      .subscribe((data) => (this.creditCardYears = data));

    this.shopFormService.getCountries().subscribe((data) => {
      console.log('Retrieved countries: ' + JSON.stringify(data));
      this.Countries = data;
    });
  }

  onSubmit() {
    console.log('onSubmit clicked');
    console.log(this.checkoutForm.get('customer')?.value);
    console.log(this.checkoutForm.get('customer')?.value.email);
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched()
    }

  }

  get firstName(){
    return this.checkoutForm.get('customer.firstName');
  }

  get lastName(){
    return this.checkoutForm.get('customer.lastName');
  }

  get email(){
    return this.checkoutForm.get('customer.email');
  }

  get billingAddressStreet() {
    return this.checkoutForm.get('billingAddress.street');
  }

  get billingAddressCity() {
    return this.checkoutForm.get('billingAddress.city');
  }

  get billingAddressState() {
    return this.checkoutForm.get('billingAddress.state');
  }

  get billingAddressZipCode() {
    return this.checkoutForm.get('billingAddress.zipCode');
  }

  get billingAddressCountry() {
    return this.checkoutForm.get('billingAddress.country');
  }
  
  get shippingAddressStreet() {
    return this.checkoutForm.get('shippingAddress.street');
  }

  get shippingAddressCity() {
    return this.checkoutForm.get('shippingAddress.city');
  }

  get shippingAddressState() {
    return this.checkoutForm.get('shippingAddress.state');
  }

  get shippingAddressZipCode() {
    return this.checkoutForm.get('shippingAddress.zipCode');
  }

  get shippingAddressCountry() {
    return this.checkoutForm.get('shippingAddress.country');
  }

  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      this.checkoutForm.controls['billingAddress'].setValue(
        this.checkoutForm.controls['shippingAddress'].value
      );
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutForm.controls['billingAddress'].reset;
      this.billingAddressStates = [];
    }
  }

  handelMonthsAndYeaars() {
    const creditCardForm = this.checkoutForm.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardForm?.value.expirationYear);

    let startMonth: number;
    if (currentYear == selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }
    this.shopFormService
      .getCreditCardMonths(startMonth)
      .subscribe((data) => (this.creditCardMonths = data));
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutForm.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country Name: ${countryCode}`);

    this.shopFormService.getStates(countryCode).subscribe((data) => {
      console.log('Retrieved states: ' + JSON.stringify(data));
      if (formGroupName == 'shippingAddress') {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }
      formGroup?.get('state')?.setValue(data[0]);
    });
  }


  reviewCartDetails() {

    this.cartService.totalPrice.subscribe(
      totalPrice=> this.totalPrice = totalPrice
    )

    this.cartService.totalQuantity.subscribe(
      totalQuantity=> this.totalQuantity = totalQuantity
    )

  }
}
