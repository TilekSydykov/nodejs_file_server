const express = require("express");
const router = express.Router()
const userService = require('../sevice/user.service')
const fileService = require('../sevice/file.service')

const multer  = require('multer');
const upload = multer({ dest: './files' });

router.get('/', (req,res) => {
    res.send('Ok');
})

router.post('/signin', async (req,res) => {
    const postData = req.body;

    const user = {
        id: postData.id,
        password: postData.password
    }
    try{
        const data = await userService.loginUser(user)
        const response = {
            "status": "Logged in",
            ...data
        }
        res.status(200).json(response);
    }catch (e) {
        res.status(400).json({error: e.message});
    }
})

router.post('/signup', async(req,res) => {
    const postData = req.body;
    const user = {
        id: postData.id,
        password: postData.password
    }
    try{
        const data = await userService.registerUser(user)
        const response = {
            "status": "Signed up",
            ...data
        }
        res.status(200).json(response);
    } catch (e) {
        res.status(400).json(e);
    }
})

router.post('/signin/new_token', async (req,res) => {
    const postData = req.body
    try  {
        if (!(postData.refreshToken) && !(postData.token)) throw new Error("not enough data")
        const user = {
            refresh_token: postData.refreshToken,
            token: postData.token
        }
        const tokens = await userService.newToken(user)
        const response = {
            token: tokens.token
        }
        res.status(200).json(response);
    } catch (e) {
        res.status(403).send({
            error: e.message
        })
    }
})

router.use(require('./tokenChecker'))

router.post('/file/upload',  upload.single('file'), async (req,res) => {
    try{
        await fileService.addFile(req.file)
        res.status(200).json({
            status:"uploaded"
        });
    }catch (e){
        res.status(500).json({
            error: e.message
        });
    }
})

router.get('/file/list',  upload.single('file'), async (req,res) => {
    try{
        const data = await fileService.listFiles(req.query.page, req.query.list_size)
        res.status(200).json(data);
    }catch (e){
        res.status(500).json({
            error: e.message
        });
    }
})

router.get('/file/:id', async (req,res) => {
    try{
        const data = await fileService.getFile(req.params.id)
        res.status(200).json(data);
    }catch (e){
        res.status(500).json({
            error: e.message
        });
    }
})

router.delete('/file/delete/:id', async (req,res) => {
    try{
        await fileService.deleteFile(req.params.id)
        res.status(200).json({result: 'ok'});
    }catch (e){
        res.status(500).json({
            error: e.message
        });
    }
})

router.put('/file/update/:id',  upload.single('file'), async (req,res) => {
    try{

        await fileService.updateFile(req.params.id, req.file)
        res.status(200).json({
            status:"updated"
        });
    }catch (e){
        res.status(500).json({
            error: e.message
        });
    }
})


router.get('/file/download/:id',  upload.single('file'), async (req,res) => {
    try{
        const file = await fileService.getFileBinary(req.params.id)
        res.setHeader('Content-Length', file.size);
        res.setHeader('Content-Type', file.mime);
        res.setHeader('Content-Disposition', 'attachment; filename=' + file.name);
        res.write(file.binary, 'binary');
        res.end();
    }catch (e){
        res.status(500).json({
            error: e.message
        });
    }
})

router.get('/info',  upload.single('file'), async (req,res) => {
    try{
        res.status(200).json({
            id: req.decoded.id
        });
    }catch (e){
        res.status(500).json({
            error: e.message
        });
    }
})

router.get('/logout',  upload.single('file'), async (req,res) => {
    try{
        await userService.logOut(req.decoded)
        res.status(200).json({
            status: "logged out"
        });
    }catch (e){
        res.status(500).json({
            error: e.message
        });
    }
})


module.exports = router
