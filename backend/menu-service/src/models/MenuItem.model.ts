import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Variant option for a menu item (e.g., Small, Medium, Large)
 */
export interface IVariant {
  variantId: string;
  name: string;
  priceDelta: number; // Price difference from base price
  available?: boolean;
}

/**
 * Addon option for a menu item (e.g., Extra Cheese, Bacon)
 */
export interface IAddon {
  addonId: string;
  name: string;
  price: number;
  available?: boolean;
  maxQuantity?: number;
}

/**
 * Source tracking for override management
 */
export interface ISource {
  overriddenFields: string[]; // Fields that differ from global FoodItem
  overriddenBy: 'restaurant' | 'migration' | 'sync' | 'admin';
  overriddenAt: Date;
  overriddenByUserId?: string;
}

/**
 * MenuItem Document Interface
 */
export interface IMenuItem extends Document {
  _id: mongoose.Types.ObjectId;
  restaurantId: string;
  foodItemId: string; // Reference to canonical FoodItem

  // Override-able fields from FoodItem
  title: string;
  description?: string;
  price: number;
  currency: string;
  images?: string[];

  // Restaurant-specific fields
  available: boolean;
  variants?: IVariant[];
  addons?: IAddon[];

  // Metadata and tracking
  metadata?: Record<string, any>;
  source?: ISource;

  // Audit fields
  createdAt: Date;
  updatedAt: Date;
  version: number; // For optimistic locking

  // Virtual fields
  isOverridden: boolean;
  effectivePrice: number;
}

/**
 * MenuItem Schema with comprehensive validation and indexing
 */
const MenuItemSchema = new Schema<IMenuItem>(
  {
    restaurantId: {
      type: String,
      required: [true, 'Restaurant ID is required'],
      index: true,
      trim: true,
    },
    foodItemId: {
      type: String,
      required: [true, 'FoodItem ID is required'],
      index: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be non-negative'],
      validate: {
        validator: function (value: number) {
          // Validate price has at most 2 decimal places
          return /^\d+(\.\d{1,2})?$/.test(value.toString());
        },
        message: 'Price must have at most 2 decimal places',
      },
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'],
      default: 'USD',
      uppercase: true,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (images: string[]) {
          return images.every((img) => /^https?:\/\/.+/.test(img));
        },
        message: 'All images must be valid URLs',
      },
    },
    available: {
      type: Boolean,
      required: true,
      default: true,
      index: true,
    },
    variants: {
      type: [
        {
          variantId: {
            type: String,
            required: true,
          },
          name: {
            type: String,
            required: true,
            trim: true,
          },
          priceDelta: {
            type: Number,
            required: true,
            default: 0,
          },
          available: {
            type: Boolean,
            default: true,
          },
        },
      ],
      default: [],
    },
    addons: {
      type: [
        {
          addonId: {
            type: String,
            required: true,
          },
          name: {
            type: String,
            required: true,
            trim: true,
          },
          price: {
            type: Number,
            required: true,
            min: 0,
          },
          available: {
            type: Boolean,
            default: true,
          },
          maxQuantity: {
            type: Number,
            min: 1,
            default: 10,
          },
        },
      ],
      default: [],
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    source: {
      type: {
        overriddenFields: {
          type: [String],
          default: [],
        },
        overriddenBy: {
          type: String,
          enum: ['restaurant', 'migration', 'sync', 'admin'],
          required: true,
        },
        overriddenAt: {
          type: Date,
          default: Date.now,
        },
        overriddenByUserId: String,
      },
      required: false,
    },
    version: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ==================== INDEXES ====================

// Compound index for efficient restaurant menu queries
MenuItemSchema.index({ restaurantId: 1, available: 1 });

// Compound index for restaurant + foodItem uniqueness
MenuItemSchema.index({ restaurantId: 1, foodItemId: 1 }, { unique: true });

// Text index for search functionality
MenuItemSchema.index({ title: 'text', description: 'text' });

// Index for reverse lookup (find all restaurants serving a food item)
MenuItemSchema.index({ foodItemId: 1, available: 1 });

// ==================== VIRTUALS ====================

MenuItemSchema.virtual('isOverridden').get(function () {
  return this.source && this.source.overriddenFields.length > 0;
});

MenuItemSchema.virtual('effectivePrice').get(function () {
  // Base price (could be enhanced with dynamic pricing logic)
  return this.price;
});

// ==================== MIDDLEWARE ====================

// Pre-save middleware for version increment (optimistic locking)
MenuItemSchema.pre('save', function (next) {
  if (this.isModified() && !this.isNew) {
    this.version += 1;
  }
  next();
});

// Pre-save middleware for validation
MenuItemSchema.pre('save', function (next) {
  // Ensure variant IDs are unique
  if (this.variants && this.variants.length > 0) {
    const variantIds = this.variants.map((v) => v.variantId);
    const uniqueIds = new Set(variantIds);
    if (variantIds.length !== uniqueIds.size) {
      return next(new Error('Variant IDs must be unique'));
    }
  }

  // Ensure addon IDs are unique
  if (this.addons && this.addons.length > 0) {
    const addonIds = this.addons.map((a) => a.addonId);
    const uniqueIds = new Set(addonIds);
    if (addonIds.length !== uniqueIds.size) {
      return next(new Error('Addon IDs must be unique'));
    }
  }

  next();
});

// ==================== STATIC METHODS ====================

MenuItemSchema.statics.findByRestaurant = function (
  restaurantId: string,
  availableOnly: boolean = false
) {
  const query: any = { restaurantId };
  if (availableOnly) {
    query.available = true;
  }
  return this.find(query).sort({ title: 1 });
};

MenuItemSchema.statics.findByFoodItem = function (foodItemId: string) {
  return this.find({ foodItemId, available: true });
};

MenuItemSchema.statics.searchMenu = function (
  restaurantId: string,
  searchQuery: string
) {
  return this.find({
    restaurantId,
    $text: { $search: searchQuery },
    available: true,
  }).sort({ score: { $meta: 'textScore' } });
};

// ==================== INSTANCE METHODS ====================

MenuItemSchema.methods.markAsUnavailable = async function () {
  this.available = false;
  return this.save();
};

MenuItemSchema.methods.updatePrice = async function (
  newPrice: number,
  updatedBy: string
) {
  this.price = newPrice;

  // Track override
  if (!this.source) {
    this.source = {
      overriddenFields: ['price'],
      overriddenBy: 'restaurant',
      overriddenAt: new Date(),
      overriddenByUserId: updatedBy,
    };
  } else if (!this.source.overriddenFields.includes('price')) {
    this.source.overriddenFields.push('price');
    this.source.overriddenAt = new Date();
    this.source.overriddenByUserId = updatedBy;
  }

  return this.save();
};

// ==================== MODEL EXPORT ====================

export interface IMenuItemModel extends Model<IMenuItem> {
  findByRestaurant(
    restaurantId: string,
    availableOnly?: boolean
  ): Promise<IMenuItem[]>;
  findByFoodItem(foodItemId: string): Promise<IMenuItem[]>;
  searchMenu(restaurantId: string, searchQuery: string): Promise<IMenuItem[]>;
}

export const MenuItem = mongoose.model<IMenuItem, IMenuItemModel>(
  'MenuItem',
  MenuItemSchema
);
