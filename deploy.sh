set -e

# 打包編譯
#npm run build

# 移動到打包資料夾下，若你有調整的話打包後的資料夾請務必調整
#cd dist 

# 部署到自定義網域
# echo 'www.example.com' > CNAME

git init # 初始化
#git checkout -b main # 建立並切換到分支
git add -A # 提交全部變更
git commit -m 'deploy' # commit 訊息


#git remote add origin git@github.com:laiiting/StockEchart.git # 你的遠端repo
#git push -f origin master # 推送到你的遠端repo
# 部署到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master
# 部署到 https://<USERNAME>.github.io/<REPO>
 git push -f -u git@github.com:laiiting/StockEchart.git master
# 除此之外，也可以改走 HTTPS 模式
# git push -f https://github.com/hsiangfeng/example-vite-react master:gh-pages

cd -