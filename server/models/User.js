import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["customer", "supervisor", "admin"],
      default: "customer",
    },
    permissions: {
      type: [String],
      enum: [
        "manage_own_profile",
        "manage_own_cart",
        "view_own_orders",
        "create_order",
        "manage_products",
        "manage_all_users",
        "view_all_orders",
        "manage_discounts",
      ],
      default: function () {
        if (this.role === "admin") {
          return [
            "manage_products",
            "manage_all_users",
            "view_all_orders",
            "manage_discounts",
          ];
        } else if (this.role === "supervisor") {
          return ["manage_products", "view_all_orders", "manage_discounts"];
        }
        return [
          "manage_own_profile",
          "manage_own_cart",
          "view_own_orders",
          "create_order",
        ];
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
