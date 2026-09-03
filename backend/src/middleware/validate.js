/**
 * Simple request body validation middleware factory.
 * Usage: router.post('/create', validate(['field1', 'field2']), handler)
 */
export const validate = (requiredFields) => (req, res, next) => {
    const missing = requiredFields.filter((field) => {
        const value = req.body[field];
        return value === undefined || value === null || value === '';
    });

    if (missing.length > 0) {
        return res.status(400).json({
            success: false,
            error: `Missing required fields: ${missing.join(', ')}`,
        });
    }

    next();
};
