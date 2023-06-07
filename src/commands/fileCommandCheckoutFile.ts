import { COMMAND_CHECKOUT_FILE } from '../constants';
import { checkFileCommand } from './abstract/createCommand';
import { createRemoteFile, 
  downloadFile,
  removeRemote, 
} from '../fileHandlers';
import { Uri } from 'vscode';
import { uriFromExplorerContextOrEditorContext } from './shared';
import { showTextDocument } from '../host';

export default checkFileCommand({
  id: COMMAND_CHECKOUT_FILE,
  getFileTarget: uriFromExplorerContextOrEditorContext,

  async handleFile(ctx) {
    const { target } = ctx;
    const uriParsed = Uri.parse(target.remoteUri.toString());

    const uriLockFile = uriParsed.with({ 
      path: uriParsed.path + '.LCK',
      query: uriParsed.query + '.LCK',
    });

    // Create the lock file
    await createRemoteFile(uriLockFile, { ignore: null });
    
    // modify the file the lock file
    // await workspace.fs.writeFile(uriLockFile, Buffer.from('writeText'));

    // Download the file and open it
    try {
      await downloadFile(ctx, { ignore: null });
      await showTextDocument(ctx.target.localUri, { preview: true });
    } catch (error) {
      // Delete the lock file
      await removeRemote(uriLockFile, { ignore: null });
      throw error;
    }
  },
});
