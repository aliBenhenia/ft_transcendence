from django.db import models

class STATICS(models.Model):

    win = models.IntegerField(default=0)
    loss = models.IntegerField(default=0)
    total_match = models.IntegerField(default=0)

    rank = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    achievements = models.IntegerField(default=1)

    xp_total = models.IntegerField(default=0)

    def level_up(self):
        if self.xp_total >= 100:
            self.xp_total = 0
            self.change_rank()
            if self.achievements + 1 <= 15:
                self.achievements += 1 
            self.save()
            return True
        return False
    
    def change_rank(self):
        if self.rank - 1 > 0:
            secondary = STATICS.objects.get(rank=self.rank - 1)
            secondary.rank += 1
            secondary.save()

            self.rank -= 1
            self.save()





