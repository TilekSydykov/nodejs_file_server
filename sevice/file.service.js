const fileRepository = require('../repository/file.repository')
var fs = require('fs');

const addFile = async file => {
    console.log(file)
    const splitedName = file.originalname.split('.')
    return await fileRepository.insertFile({
        name: file.originalname,
        mime: file.mimetype,
        path: file.path,
        size: file.size,
        type: splitedName[splitedName.length - 1]
    })
}

const listFiles = async (page, limit) => {
    if (!page) page = 1
    if (!limit) limit = 10
    return await fileRepository.listFiles((page -1) * limit, limit);
}

const getFile = async (id) => {
    const filesFromDb = await fileRepository.getFileById(id)
    if (filesFromDb.length < 1){
        throw new Error("not found")
    }
    return filesFromDb[0]
}

const deleteFile = async (id) => {
    const filesFromDb = await fileRepository.getFilePathById(id)
    if (filesFromDb.length < 1){
        throw new Error("not found")
    }
    const deletedResult = await fileRepository.deleteFileById(id)
    if (deletedResult.affectedRows < 1) {
        throw new Error("failed to delete")
    }
    await fs.unlinkSync(filesFromDb[0].path)
}

const getFileBinary = async (id) => {
    const filesFromDb = await fileRepository.getFileWithPathById(id)
    if (filesFromDb.length < 1){
        throw new Error("not found")
    }
    // было бы лучше использовать пайпы но так тоже норм
    return {
        binary: fs.readFileSync(filesFromDb[0].path, 'binary'),
        ...filesFromDb[0]
    };
}

const updateFile =  async (id, file) => {
    const splitedName = file.originalname.split('.')
    const fileToUpdate = {
        name: file.originalname,
        mime: file.mimetype,
        path: file.path,
        size: file.size,
        type: splitedName[splitedName.length - 1]
    }
    const fileFromDb = await fileRepository.getFilePathById(id)
    if (fileFromDb.length < 1){
        throw new Error("not found")
    }
    const updateResults = await fileRepository.updateFile(id, fileToUpdate)
    if (updateResults.affectedRows < 1) {
        throw new Error("couldn't update")
    }
    await fs.unlinkSync(fileFromDb[0].path)
}

module.exports = {
    addFile,
    listFiles,
    getFile,
    deleteFile,
    updateFile,
    getFileBinary
}
