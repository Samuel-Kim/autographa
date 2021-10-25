/* eslint-disable no-underscore-dangle */
import Parse from 'parse';

const findBookFromParse = async ({
    _username,
    _projectName,
}) => {
        const ProjectMeta = Parse.Object.extend('ProjectMeta');
        const Files = Parse.Object.extend('Files');
        const newUserQuery = new Parse.Query(ProjectMeta);
        const filesQuery = new Parse.Query(Files);
        const scopeFiles = [];
        filesQuery.include('owner');
        newUserQuery.include('owner');
        await newUserQuery.find();
        const filesResult = await filesQuery.find();
        return new Promise((resolve) => {
        filesResult.forEach(async (element) => {
            if (element?.get('owner')?.get('owner')?.get('email') === _username) {
                if (element?.get('owner')?.get('projectName') === _projectName) {
                    scopeFiles.push(element?.get('scope'));
                       resolve(scopeFiles);
                }
            }
        });
    });
};
export default findBookFromParse;
