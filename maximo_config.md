# mx-vue-mr

### Maximo configuration
Login to Maximo with an admin account and execute the following configuration steps:

1. Go to **Integration > Object Structures** and create a new object structure as follows.
    - **Object Structure:** V-MR
    - **Description:** Vue Material Reservation
    - **Consumed By:** INTEGRATION
    - **Inbound Processing Class:** `psdi.iface.mic.StatefulMicSetIn`
    - **Source Objects for V-MR (1)**:
        - **Object:** MR
        - **Parent Object:** -
        - **Relationship:** -
        - **Object Order:** 1
    - **Source Objects for V-MR (2)**:
        - **Object:** MRLINE
        - **Parent Object:** MR
        - **Relationship:** MRLINE
        - **Object Order:** 1
    
2. Save object structure.
3. Go to **System Configuration > Platform Configuration > Database Configuration**.
4. Bring up the `INVUSE` object and go to the **Relationships** tab.
5. Create a new relationship as follows:
    - **Relationship:** V-MR
    - **Child Object:** MR
    - **Remarks:** Inventory usage records created from material reservations
    - **Where Clause:**
    ```
    exists (select 1 from invuseline 
        where invusenum = :invusenum 
              and siteid = :siteid and mrnum = mr.mrnum)
    ```
6. Go to **Administration > Organizations** and bring up your organization.
7. Open the organization and under the **More Actions** menu select **Inventory Options > Inventory Defaults**.
8. Check the **Automatically create usage documents for new reservations?** box.
9. Click **OK** on the dialog to save your changes. 
    