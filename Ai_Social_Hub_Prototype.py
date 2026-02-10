# AI Social Hub Prototype
# 已修正：移除互動式 input() 以避免在無互動環境出錯
# 新增：基本測試案例與範例執行模式
# 目標：把常見 AI 工具流程整合，讓新手可以一鍵產出社群內容
# 架構：
# 1. 主題生成
# 2. 腳本生成
# 3. 圖片生成
# 4. 影片字幕
# 5. 排程發佈（模擬）

import json
from dataclasses import dataclass, asdict
from typing import List

# -------------------- 資料模型 --------------------

@dataclass
class Topic:
    title: str
    hook: str
    outline: List[str]

@dataclass
class Script:
    topic: str
    lines: List[str]
    cta: str

@dataclass
class PostPackage:
    topic: Topic
    script: Script
    image_prompt: str
    hashtags: List[str]

# -------------------- 模擬 AI 服務 --------------------

class AIBrain:
    """模擬 ChatGPT / Claude"""

    def generate_topics(self, product: str) -> List[Topic]:
        return [
            Topic(
                title=f"新手也能懂的 {product} 選法",
                hook="90%的人第一步就選錯",
                outline=[
                    "常見三大地雷",
                    "挑選關鍵指標",
                    "高CP搭配"
                ]
            )
        ]

    def write_script(self, topic: Topic) -> Script:
        lines = [
            f"今天教你：{topic.title}",
            topic.hook,
            *topic.outline,
            "實測與推薦"
        ]
        return Script(topic=topic.title, lines=lines, cta="點連結看商品")

class ImageAI:
    """模擬 Midjourney / DALL·E"""

    def create_prompt(self, topic: Topic) -> str:
        return f"電商情境圖, {topic.title}, 乾淨簡約風"

class Publisher:
    """模擬社群發布"""

    def publish(self, package: PostPackage, platform: str):
        print(f"[發布到 {platform}] {package.topic.title}")

# -------------------- 核心流程 --------------------

class SocialAutomationApp:

    def __init__(self):
        self.brain = AIBrain()
        self.image_ai = ImageAI()
        self.publisher = Publisher()

    def run(self, product: str, platform="tiktok"):
        if not product:
            raise ValueError("product 不可為空")

        topics = self.brain.generate_topics(product)
        packages: List[PostPackage] = []

        for t in topics:
            script = self.brain.write_script(t)
            img_prompt = self.image_ai.create_prompt(t)

            pkg = PostPackage(
                topic=t,
                script=script,
                image_prompt=img_prompt,
                hashtags=["#電商", "#開箱", "#教學"]
            )

            packages.append(pkg)

        for p in packages:
            self.publisher.publish(p, platform)

        return packages

# -------------------- 輸出工具 --------------------

def save_result(packages: List[PostPackage], path="output.json"):
    data = [
        {
            "topic": asdict(p.topic),
            "script": asdict(p.script),
            "image_prompt": p.image_prompt,
            "hashtags": p.hashtags
        }
        for p in packages
    ]

    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# -------------------- 測試案例 --------------------

def test_basic_flow():
    app = SocialAutomationApp()
    result = app.run("手機殼")

    assert len(result) > 0
    assert "手機殼" in result[0].topic.title
    assert result[0].script.cta == "點連結看商品"
    print("test_basic_flow passed")


def test_empty_product():
    app = SocialAutomationApp()
    try:
        app.run("")
    except ValueError:
        print("test_empty_product passed")
        return
    raise AssertionError("empty product 應該要拋出錯誤")

# -------------------- 範例執行 --------------------

if __name__ == "__main__":
    # 非互動環境使用預設值
    demo_product = "示範商品"

    app = SocialAutomationApp()
    result = app.run(demo_product)
    save_result(result)

    # 執行測試
    test_basic_flow()
    test_empty_product()

    print("完成！已輸出 output.json")
