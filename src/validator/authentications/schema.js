const Joi = require('joi')

const PostAuthenticationPayloadsSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
})
const PutAuthenticationPayloadsSchema = Joi.object({
    refreshToken: Joi.string().required(),
})

const DeleteAuthenticationPayloadsSchema = Joi.object({
    refreshToken: Joi.string().required(),
})


module.exports = {
    PostAuthenticationPayloadsSchema,
    PutAuthenticationPayloadsSchema,
    DeleteAuthenticationPayloadsSchema
}