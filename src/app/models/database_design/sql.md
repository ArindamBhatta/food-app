# Food Delivery App Database Design Sql

- One to Many Relationship

  > Customer create multiple order

  - in Order table we store a foreign key call CustomerId

  > Vendor create multiple food

  - in Food table we store a foreign key call VendorId

  > Customer cart we store many food with quantity

  - in Customer table we store a foreign key call CartId

- Many to Many Relationship

  > In Order we have many foods, and one food can be in multiple orders

---

- How to solve many to many relationship?

        Create a new table call OrderItems

        OrderItems can store a foreign key call OrderId

        OrderItems can store a foreign key call FoodId
