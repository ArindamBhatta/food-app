### Admin specific work

1. Admin can create vendors

2. Admin gets a list of all vendors

3. 3. Admin gets details of a specific vendor.

### Vendor specific work

1.Vendor can view his own profile.

2.Vendor can update his own profile.

3. Vendor can add Food.

### Create a vendor

steps: -

1. AdminRoute -> go to create a vendor route

2. AdminController -> create a method call createVendor
   2.1. DTO -> a interface for checking request body is valid or not
   2.2. find the vendor email is already exist.
   2.3. if not exist generate a salt bcrypt.genSalt();
   2.4. then send the user password and salt. to generate password.
   2.5. store everything in database.

   ### mongoose update method

   Model.updateOne(), Model.updateMany(), Model.findByIdAndUpdate() skip schema validation.
   This is because these methods operate directly at the MongoDB level, without loading a Mongoose document into memory

   - minlength: 3 -> ✅ No error — it will save "A" to the database, even though it breaks your schema rule
   - runValidators: true

   ### mongoose hook

   - Runs Mongoose middleware/hooks (pre('save'), post('save')).
