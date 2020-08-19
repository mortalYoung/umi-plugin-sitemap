const path = require('path');
const fs = require('fs');
const { execSync, spawnSync } = require('child_process');

if (!fs.existsSync(path.resolve(__dirname, '../lib'))) {
  const stdout = execSync('npm run build').toString();
  if (stdout.indexof('Transform to cjs for') === -1) {
    throw new Error('test failed');
  }
}

if (!fs.existsSync(path.resolve(__dirname, '../example/node_modules'))) {
  const stdout = execSync('cd example && yarn').toString();
  if (stdout.indexof('success') === -1) {
    throw new Error('example install failed');
  }
}
const { stdout, stderr } = spawnSync('yarn.cmd', ['build'], {
  cwd: path.resolve(__dirname, '../example'),
  env: {
    UMI_ENV: 'sitemap',
  },
});
console.log(stderr.toString());

// describe('example test', () => {
//   it('test without config parameters', () => {
//     const { stderr } = spawnSync('yarn.cmd', ['build'], {
//       cwd: path.resolve(__dirname, '../example'),
//     });
//     expect(stderr.toString()).toContain(
//       'Compiled sitemap.xml failed, Please check your homepage',
//     );
//   });

//   it('test without [sitemap] config parameters', () => {
//     const { stdout } = spawnSync('yarn.cmd', ['build'], {
//       cwd: path.resolve(__dirname, '../example'),
//       env: {
//         UMI_ENV: 'sitemap',
//       },
//     });
//     expect(stderr.toString()).toContain(
//       'Compiled sitemap.xml failed, Please check your homepage',
//     );
//   });
// });
